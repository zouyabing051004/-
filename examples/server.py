"""
传统文化智能体 · 后端代理（最小可用版）

职责：
  1. 保护 API Key（Key 只存服务器环境变量，绝不下发前端）
  2. /api/chat   -> DeepSeek 对话（含系统提示词注入，RAG 检索为占位函数）
  3. /api/image  -> 智谱 CogView-3-Flash 文生图（免费）
  4. /api/video  -> 智谱 CogVideoX-Flash 文生视频（免费，异步：提交+查询）
  5. 简单的按 IP 限流 与 结果缓存

运行：
  pip install fastapi uvicorn httpx
  export DEEPSEEK_API_KEY=sk-...      # https://platform.deepseek.com
  export ZHIPU_API_KEY=...            # https://bigmodel.cn -> API Keys
  uvicorn server:app --host 0.0.0.0 --port 8000
"""

import hashlib
import json
import os
import time
from collections import defaultdict
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
ZHIPU_API_KEY = os.environ.get("ZHIPU_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
ZHIPU_IMAGE_URL = "https://open.bigmodel.cn/api/paas/v4/images/generations"
ZHIPU_VIDEO_URL = "https://open.bigmodel.cn/api/paas/v4/videos/generations"
ZHIPU_VIDEO_QUERY = "https://open.bigmodel.cn/api/paas/v4/async-result/{id}"

CACHE_DIR = Path("cache")
CACHE_DIR.mkdir(exist_ok=True)

app = FastAPI(title="传统文化智能体后端")
app.add_middleware(  # 上线后把 allow_origins 收紧为你的秒哒站域名
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

# ---------- 简单限流：每 IP 每分钟 10 次 ----------
_hits: dict[str, list[float]] = defaultdict(list)

def rate_limit(request: Request, limit: int = 10, window: int = 60):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    _hits[ip] = [t for t in _hits[ip] if now - t < window]
    if len(_hits[ip]) >= limit:
        raise HTTPException(429, "请求太频繁，请稍候再试")
    _hits[ip].append(now)


# ---------- RAG 检索（占位：接入向量库前，先用节气表做关键词匹配） ----------
def retrieve_docs(query: str) -> str:
    """TODO: 替换为向量检索（chinese-poetry 数据 + sqlite-vec/Chroma）。
    现阶段返回空字符串也能工作，只是回答不带原文锚定。"""
    return ""


SYSTEM_PROMPT_TEMPLATE = (Path(__file__).parent.parent / "prompts" / "system_prompt.md").read_text(
    encoding="utf-8"
)


def build_system_prompt(query: str) -> str:
    # 简化：直接取 markdown 中第一个代码块内容再填槽位
    body = SYSTEM_PROMPT_TEMPLATE.split("```")[1]
    return (
        body.replace("{today}", time.strftime("%Y年%m月%d日"))
        .replace("{solar_term}", current_solar_term())
        .replace("{retrieved_docs}", retrieve_docs(query) or "（本次无检索结果）")
    )


def current_solar_term() -> str:
    """TODO: 用节气日期表精确计算，这里先返回占位值。"""
    return "小暑"


# ---------- /api/chat ----------
class ChatReq(BaseModel):
    message: str
    history: list[dict] = []  # [{"role":"user"|"assistant","content":"..."}]


@app.post("/api/chat")
async def chat(req: ChatReq, request: Request):
    rate_limit(request)
    if not DEEPSEEK_API_KEY:
        raise HTTPException(500, "服务端未配置 DEEPSEEK_API_KEY")
    messages = (
        [{"role": "system", "content": build_system_prompt(req.message)}]
        + req.history[-10:]
        + [{"role": "user", "content": req.message}]
    )
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            DEEPSEEK_URL,
            headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}"},
            json={"model": "deepseek-chat", "messages": messages, "temperature": 0.7},
        )
    r.raise_for_status()
    text = r.json()["choices"][0]["message"]["content"]

    # 解析【生成画面协议】：末尾的 GEN|{...} 行
    gen = None
    if "GEN|" in text:
        text, _, tail = text.rpartition("GEN|")
        try:
            gen = json.loads(tail.strip())
        except json.JSONDecodeError:
            gen = None
        text = text.strip()
    return {"reply": text, "gen": gen}


# ---------- /api/image ----------
class ImageReq(BaseModel):
    prompt: str          # 已套用风格模板的完整提示词
    cache_key: str = ""  # 例如 "小暑|T1"，命中则直接返回上次结果
    size: str = "1024x1024"


@app.post("/api/image")
async def image(req: ImageReq, request: Request):
    rate_limit(request, limit=5)
    if not ZHIPU_API_KEY:
        raise HTTPException(500, "服务端未配置 ZHIPU_API_KEY")
    key = req.cache_key or hashlib.md5(req.prompt.encode()).hexdigest()
    cache_file = CACHE_DIR / f"img_{hashlib.md5(key.encode()).hexdigest()}.json"
    if cache_file.exists():
        return json.loads(cache_file.read_text())

    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post(
            ZHIPU_IMAGE_URL,
            headers={"Authorization": f"Bearer {ZHIPU_API_KEY}"},
            json={"model": "cogview-3-flash", "prompt": req.prompt, "size": req.size},
        )
    r.raise_for_status()
    result = {"url": r.json()["data"][0]["url"], "cached": False}
    cache_file.write_text(json.dumps({**result, "cached": True}, ensure_ascii=False))
    return result


# ---------- /api/video（异步：先提交任务，再轮询） ----------
class VideoReq(BaseModel):
    prompt: str
    image_url: str = ""  # 传了则走图生视频（推荐）


@app.post("/api/video")
async def video_submit(req: VideoReq, request: Request):
    rate_limit(request, limit=2)
    if not ZHIPU_API_KEY:
        raise HTTPException(500, "服务端未配置 ZHIPU_API_KEY")
    payload: dict = {"model": "cogvideox-flash", "prompt": req.prompt}
    if req.image_url:
        payload["image_url"] = req.image_url
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            ZHIPU_VIDEO_URL,
            headers={"Authorization": f"Bearer {ZHIPU_API_KEY}"},
            json=payload,
        )
    r.raise_for_status()
    return {"task_id": r.json()["id"]}


@app.get("/api/video/{task_id}")
async def video_query(task_id: str, request: Request):
    rate_limit(request, limit=30)
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            ZHIPU_VIDEO_QUERY.format(id=task_id),
            headers={"Authorization": f"Bearer {ZHIPU_API_KEY}"},
        )
    r.raise_for_status()
    data = r.json()
    if data.get("task_status") == "SUCCESS":
        return {"status": "done", "url": data["video_result"][0]["url"]}
    if data.get("task_status") == "FAIL":
        return {"status": "failed"}
    return {"status": "processing"}
