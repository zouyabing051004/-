# 传统文化智能体（二十四节气 · 古诗词）

为秒哒站点 https://app-c2zk70llophd.appmiaoda.com 配套的传统文化智能体项目。

**核心架构**：DeepSeek 当大脑（对话/赏析/意图路由），智谱免费模型当画笔（CogView-3-Flash 生图、CogVideoX-Flash 生视频），自建诗词/节气知识库当记忆（RAG，杜绝信息污染）。

| 文件 | 内容 |
|---|---|
| [传统文化智能体规划方案.md](./传统文化智能体规划方案.md) | **完整规划**：选型分析、架构、功能设计、知识库方案、生成 pipeline、集成方式、成本、路线图、合规 |
| [prompts/system_prompt.md](./prompts/system_prompt.md) | 智能体系统提示词 + 意图路由提示词 |
| [prompts/scene_templates.md](./prompts/scene_templates.md) | 6 套图片/视频风格模板 + 节气意象词库 |
| [examples/server.py](./examples/server.py) | FastAPI 后端代理（可直接部署起步） |
| [examples/widget.html](./examples/widget.html) | 可嵌入秒哒站的聊天挂件示例 |

## 快速开始

```bash
pip install fastapi uvicorn httpx
export DEEPSEEK_API_KEY=sk-...   # platform.deepseek.com 注册（送 500 万 token）
export ZHIPU_API_KEY=...         # bigmodel.cn 注册（生图/生视频免费）
uvicorn examples.server:app --host 0.0.0.0 --port 8000
# 浏览器打开 examples/widget.html（把里面 API_BASE 改成后端地址）
```
