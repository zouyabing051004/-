// 传统文化智能体「知节」
// 大脑：DeepSeek（deepseek-chat Edge Function）
// 画笔：MiniMax 文生图 + Kling 图生视频（复用已有 Edge Function）
// 记忆：solarTerms + poetryLibrary 本地精选知识库（原文锚定，杜绝背错诗）
import { supabase } from "@/db/supabase";
import { sendStreamRequest } from "@/lib/sse";
import { solarTerms } from "@/data/solarTerms";
import { searchPoems, formatPoemForPrompt } from "@/data/poetryLibrary";
import { containsSensitiveContent, SAFE_RESPONSES } from "./safety";
import { submitImageToVideo, queryVideoTask } from "./ai";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

// ---------- 知识检索（原文锚定层） ----------

function retrieveKnowledge(query: string): string {
  const parts: string[] = [];

  // 命中节气：注入结构化节气资料
  const matchedTerms = solarTerms
    .filter((t) => query.includes(t.name) || t.keywords.some((k) => query.includes(k)))
    .slice(0, 2);
  for (const t of matchedTerms) {
    parts.push(
      `【节气资料】${t.name}（${t.date}，${t.season}季）\n` +
        `气候：${t.climate}\n物候：${t.phenology}\n` +
        `习俗：吃${t.customs.eat}；做${t.customs.do}\n` +
        `代表诗：《${t.poem.title}》（${t.poem.author}）\n${t.poem.content}`
    );
  }

  // 命中诗词：注入原文
  const matchedPoems = searchPoems(query, 3);
  for (const p of matchedPoems) {
    parts.push(`【诗词原文】${formatPoemForPrompt(p)}\n儿童导读：${p.kidNote}`);
  }

  return parts.join("\n\n");
}

function buildSystemPrompt(query: string): string {
  const docs = retrieveKnowledge(query);
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `你是"知节"，一位温润博学的中国传统文化向导，服务于一个二十四节气儿童教育网站，用户主要是3-8岁的小朋友和他们的家长。

今天是${today}。

【你的能力】
1. 讲二十四节气：由来、三候、习俗、饮食、农事
2. 讲古诗词：白话释义、意象、背后的小故事
3. 讲传统节日：春节、元宵、清明、端午、七夕、中秋、重阳等
4. 陪小朋友玩诗词接龙、猜节气等小游戏

【铁律：原文锚定】
- 引用诗词原文时，只能逐字使用下方【参考资料】中提供的文本，并注明题目和作者
- 参考资料里没有的诗，可以介绍它讲了什么，但不要默写全文，并说"原文可以请爸爸妈妈帮你查一查哦"
- 不编造习俗、典故和出处，不确定就说不确定

【参考资料】
${docs || "（本次没有检索到相关资料）"}

【语气】
像温柔的老师跟小朋友说话：句子短、用词简单、多打比方、适当用emoji。
回答不超过200字。只聊传统文化相关话题，无关问题温柔地引导回来。`;
}

// ---------- 流式对话 ----------

export async function streamCultureChat(
  userMessage: string,
  history: ChatTurn[],
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  if (containsSensitiveContent(userMessage)) {
    onChunk(SAFE_RESPONSES.sensitive);
    onDone();
    return;
  }

  await sendStreamRequest({
    functionUrl: `${supabaseUrl}/functions/v1/deepseek-chat`,
    requestBody: {
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(userMessage) },
        ...history.slice(-8),
        { role: "user", content: userMessage },
      ],
    },
    supabaseAnonKey,
    onData: (rawData) => {
      try {
        if (rawData === "[DONE]") return;
        const parsed = JSON.parse(rawData);
        const chunk = parsed.choices?.[0]?.delta?.content ?? "";
        if (chunk) onChunk(chunk);
      } catch {
        // 不完整chunk，跳过
      }
    },
    onComplete: onDone,
    onError,
    signal,
  });
}

// ---------- 场景生成管线 ----------

export type MediaIntent = "image" | "video" | null;

export function detectMediaIntent(text: string): MediaIntent {
  if (/(视频|短片|动画|动起来|做成动的)/.test(text)) return "video";
  if (/(画|配图|图片|插画|生成.*图|来一?[张幅])/.test(text)) return "image";
  return null;
}

export interface SceneSpec {
  scene: string;
  elements: string[];
  timeLight: string;
  mood: string;
  palette: string;
}

export interface SceneStyle {
  id: string;
  name: string;
  build: (s: SceneSpec) => string;
}

const NEGATIVE = "画面中不要出现任何文字、水印、logo、现代建筑、汽车、电线";

export const SCENE_STYLES: SceneStyle[] = [
  {
    id: "shuimo",
    name: "水墨写意",
    build: (s) =>
      `中国传统水墨画，写意风格，${s.scene}，画面主体：${s.elements.join("、")}，` +
      `${s.timeLight}，大量留白构图，宣纸质感，淡墨晕染，意境${s.mood}，` +
      `主色调${s.palette}，笔触松弛克制，杰作，高清。${NEGATIVE}`,
  },
  {
    id: "guochao",
    name: "国潮插画",
    build: (s) =>
      `现代国潮插画，扁平风格，${s.scene}，${s.elements.join("、")}，` +
      `明快的${s.palette}色块，柔和渐变，圆润造型，${s.mood}氛围，` +
      `构图居中，装饰感强，矢量插画质感，4k。${NEGATIVE}`,
  },
  {
    id: "huiben",
    name: "儿童绘本",
    build: (s) =>
      `中国传统儿童绘本插画风格，色彩明亮温暖，卡通可爱，适合3-8岁儿童，` +
      `${s.scene}，${s.elements.join("、")}，${s.timeLight}，${s.mood}的氛围，` +
      `画面干净清晰。${NEGATIVE}`,
  },
];

// 用 DeepSeek 从诗词/话题中抽取画面要素（JSON模式）
export async function extractSceneSpec(topic: string): Promise<SceneSpec> {
  const fallback: SceneSpec = {
    scene: topic.slice(0, 30),
    elements: ["传统文化场景"],
    timeLight: "柔和自然光",
    mood: "宁静美好",
    palette: "淡雅国风色",
  };

  const { data, error } = await supabase.functions.invoke("deepseek-chat", {
    body: {
      json_mode: true,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "你是画面设计师。根据用户给出的诗词或传统文化主题，抽取适合作画的场景要素，只输出JSON：" +
            '{"scene":"场景一句话","elements":["要素1","要素2","要素3"],"timeLight":"时间与光线","mood":"情绪氛围","palette":"主色调"}。' +
            "要素要具体可画（如：小荷尖角、蜻蜓），画面适合儿童观看。",
        },
        { role: "user", content: topic },
      ],
    },
  });
  if (error || !data?.content) return fallback;

  try {
    const parsed = JSON.parse(data.content as string);
    return {
      scene: typeof parsed.scene === "string" ? parsed.scene : fallback.scene,
      elements: Array.isArray(parsed.elements) && parsed.elements.length > 0
        ? parsed.elements.map(String)
        : fallback.elements,
      timeLight: typeof parsed.timeLight === "string" ? parsed.timeLight : fallback.timeLight,
      mood: typeof parsed.mood === "string" ? parsed.mood : fallback.mood,
      palette: typeof parsed.palette === "string" ? parsed.palette : fallback.palette,
    };
  } catch {
    return fallback;
  }
}

// 文生图（复用 MiniMax Edge Function，自定义完整提示词）
export async function generateScenePicture(prompt: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("minimax-text-to-image", {
    body: { prompt, model: "image-01", aspect_ratio: "1:1", n: 1 },
  });
  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (!data?.image_urls?.[0]) throw new Error("未返回图片URL");
  return data.image_urls[0] as string;
}

// 图生视频：先出图（可控），再让画面动起来（复用 Kling Edge Function）
export async function generateSceneVideo(
  imageUrl: string,
  spec: SceneSpec
): Promise<string> {
  const motionPrompt =
    `画面保持原有构图与风格，${spec.elements[0] ?? "主体"}轻微自然运动，` +
    `光线缓缓流转，镜头极缓慢推近，其余元素保持稳定，慢节奏，意境${spec.mood}`;
  return submitImageToVideo(imageUrl, motionPrompt);
}

// 轮询视频任务直到完成（最长约3分钟）
export async function waitForVideo(
  taskId: string,
  onTick?: (elapsedSeconds: number) => void,
  signal?: AbortSignal
): Promise<string> {
  const intervalMs = 5000;
  const maxTries = 36;
  for (let i = 1; i <= maxTries; i++) {
    if (signal?.aborted) throw new Error("已取消");
    await new Promise((r) => setTimeout(r, intervalMs));
    onTick?.((i * intervalMs) / 1000);
    const result = await queryVideoTask(taskId);
    if (result.status === "succeed" && result.videoUrl) return result.videoUrl;
    if (result.status === "failed") throw new Error("视频生成失败，请换个描述再试");
  }
  throw new Error("视频生成超时，请稍后再试");
}
