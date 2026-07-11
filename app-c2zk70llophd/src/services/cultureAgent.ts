// 传统文化智能体「知节 / Zhijie」—— 面向国际儿童传播中华传统文化
// 大脑：DeepSeek（deepseek-chat Edge Function）
// 画笔：MiniMax 文生图 + Kling 图生视频（复用已有 Edge Function）
// 记忆：solarTerms + poetryLibrary 本地精选知识库（原文/拼音/英译三重锚定）
//       + localStorage 轻量用户画像（延时记忆第一步）
import { supabase } from "@/db/supabase";
import { sendStreamRequest } from "@/lib/sse";
import { solarTerms } from "@/data/solarTerms";
import { searchPoems, formatPoemForPrompt } from "@/data/poetryLibrary";
import { searchBasePoetry, formatBasePoemForPrompt } from "@/data/basePoetry";
import { containsSensitiveContent, SAFE_RESPONSES } from "./safety";
import { submitImageToVideo, queryVideoTask } from "./ai";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export type AgentLanguage = "zh" | "en" | "bilingual";

// ---------- 轻量用户画像（延时记忆第一步，仅存本地，不采集个人数据） ----------

export interface UserProfile {
  nickname?: string; // 孩子自己告诉智能体的称呼
  language: AgentLanguage;
  recentTopics: string[]; // 最近聊过的节气/诗词，用于"因人而异"的开场和推荐
}

const PROFILE_KEY = "culture-agent-profile";

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserProfile;
      return {
        nickname: typeof parsed.nickname === "string" ? parsed.nickname : undefined,
        language: parsed.language === "en" || parsed.language === "bilingual" ? parsed.language : "zh",
        recentTopics: Array.isArray(parsed.recentTopics) ? parsed.recentTopics.slice(0, 5) : [],
      };
    }
  } catch {
    // 解析失败则重置
  }
  return { language: "zh", recentTopics: [] };
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // 隐私模式等场景忽略
  }
}

// 从用户消息中沉淀话题记忆（命中的节气名/诗名）
export function rememberTopics(profile: UserProfile, query: string): UserProfile {
  const topics: string[] = [];
  for (const t of solarTerms) {
    if (query.includes(t.name)) topics.push(t.name);
  }
  for (const p of searchPoems(query, 2)) {
    topics.push(`《${p.title}》`);
  }
  if (topics.length === 0) return profile;
  const merged = [...topics, ...profile.recentTopics.filter((t) => !topics.includes(t))];
  const next = { ...profile, recentTopics: merged.slice(0, 5) };
  saveProfile(next);
  return next;
}

// ---------- 知识检索（两层锚定：精选层三重校准 + 底层库约480首原文） ----------

async function retrieveKnowledge(query: string): Promise<string> {
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

  // 精选层（人工校准：原文+拼音+英译）
  const matchedPoems = searchPoems(query, 3);
  for (const p of matchedPoems) {
    parts.push(
      `【诗词资料·精选层】${formatPoemForPrompt(p)}\n儿童导读：${p.kidNote}\nKid note: ${p.kidNoteEn}`
    );
  }

  // 底层库（约480首唐诗宋词元曲，原文可靠；拼音为机器标注）
  // 精选层已命中足够内容时少取，避免上下文过长
  const baseLimit = matchedPoems.length >= 2 ? 1 : 2;
  const basePoems = await searchBasePoetry(query, baseLimit);
  const curatedTitles = new Set(matchedPoems.map((p) => p.title));
  for (const p of basePoems) {
    if (curatedTitles.has(p.title)) continue;
    parts.push(`【诗词资料·底层库】${formatBasePoemForPrompt(p)}`);
  }

  return parts.join("\n\n");
}

const LANGUAGE_RULES: Record<AgentLanguage, string> = {
  zh: "【语言】始终用中文回答。像温柔的老师跟小朋友说话：句子短、用词简单、多打比方、适当用emoji。",
  en:
    "【Language】Always reply in simple, warm English suitable for children aged 5-10 (CEFR A1-A2 vocabulary, short sentences, friendly tone, some emoji). " +
    "When quoting a Chinese poem, show each line in three rows: Chinese characters, then pinyin, then the English meaning — all copied EXACTLY from the reference material. " +
    "Briefly explain Chinese cultural words (e.g. jiaozi = Chinese dumplings).",
  bilingual:
    "【语言/Language】Reply bilingually: first a short Chinese sentence, then its simple English translation on the next line, pair by pair. " +
    "Keep both languages child-friendly and short. Poem lines must show Chinese + pinyin + English, copied EXACTLY from the reference material.",
};

async function buildSystemPrompt(
  query: string,
  language: AgentLanguage,
  profile: UserProfile
): Promise<string> {
  const docs = await retrieveKnowledge(query);
  const today = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const memory =
    (profile.nickname ? `用户希望被称呼为"${profile.nickname}"。` : "") +
    (profile.recentTopics.length > 0
      ? `用户最近聊过：${profile.recentTopics.join("、")}。可以自然地衔接或推荐相关内容，但不要每句都提。`
      : "");

  return `你是"知节"（英文名 Zhijie），一位温润博学的中国传统文化向导，服务于一个面向全世界儿童传播中华传统文化的网站。用户主要是5-10岁的外国小朋友和他们的家长，多数不以中文为母语。

今天是${today}。

【你的使命】
让不了解中国的孩子也能听懂、喜欢上二十四节气、古诗词和传统节日。多用世界儿童熟悉的事物打比方（比如：冬至像"中国的感恩节晚餐夜"，春节像"最盛大的家庭派对"）。

【你的能力】
1. 讲二十四节气：由来、三候、习俗、饮食、农事
2. 教古诗词：逐句带读（汉字+拼音+英文意思）、讲背后的小故事
3. 讲传统节日：春节、元宵、清明、端午、七夕、中秋、重阳等
4. 陪小朋友玩诗词接龙、猜节气等小游戏

【铁律：锚定资料，防止幻觉】
- 诗词的原文、拼音、英文意思，只能逐字使用下方【参考资料】提供的内容，并注明题目和作者
- 标注"精选层"的资料是人工校准的，可放心引用拼音和英译
- 标注"底层库"的资料原文可靠，但拼音是机器标注：引用其拼音时提醒"个别多音字读音请以老师讲解为准"；英文意思可以由你意译，但要说明是大意（paraphrase），不是权威翻译
- 参考资料里没有的诗，可以介绍它讲了什么，但不要默写原文或自编拼音
- 不编造习俗、典故和出处，不确定就说不确定

【延时记忆】
${memory || "（暂无用户记忆）"}

【参考资料】
${docs || "（本次没有检索到相关资料）"}

${LANGUAGE_RULES[language]}

【边界】
回答不超过250字（或同等长度英文）。只聊中华传统文化相关话题，无关问题温柔地引导回来。尊重各国文化，只做介绍分享，不做比较贬低。`;
}

// ---------- 流式对话 ----------

export async function streamCultureChat(
  userMessage: string,
  history: ChatTurn[],
  language: AgentLanguage,
  profile: UserProfile,
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

  const systemPrompt = await buildSystemPrompt(userMessage, language, profile);
  await sendStreamRequest({
    functionUrl: `${supabaseUrl}/functions/v1/deepseek-chat`,
    requestBody: {
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
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
  const lower = text.toLowerCase();
  if (
    /(视频|短片|动画|动起来|做成动的)/.test(text) ||
    /\b(video|animate|animation|movie|clip)\b/.test(lower)
  ) {
    return "video";
  }
  if (
    /(画|配图|图片|插画|生成.*图|来一?[张幅])/.test(text) ||
    /\b(draw|paint|picture|image|illustration|art)\b/.test(lower)
  ) {
    return "image";
  }
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
  nameEn: string;
  build: (s: SceneSpec) => string;
}

const NEGATIVE = "画面中不要出现任何文字、水印、logo、现代建筑、汽车、电线";

export const SCENE_STYLES: SceneStyle[] = [
  {
    id: "shuimo",
    name: "水墨写意",
    nameEn: "Ink Wash",
    build: (s) =>
      `中国传统水墨画，写意风格，${s.scene}，画面主体：${s.elements.join("、")}，` +
      `${s.timeLight}，大量留白构图，宣纸质感，淡墨晕染，意境${s.mood}，` +
      `主色调${s.palette}，笔触松弛克制，杰作，高清。${NEGATIVE}`,
  },
  {
    id: "guochao",
    name: "国潮插画",
    nameEn: "Neo-Chinese",
    build: (s) =>
      `现代国潮插画，扁平风格，${s.scene}，${s.elements.join("、")}，` +
      `明快的${s.palette}色块，柔和渐变，圆润造型，${s.mood}氛围，` +
      `构图居中，装饰感强，矢量插画质感，4k。${NEGATIVE}`,
  },
  {
    id: "huiben",
    name: "儿童绘本",
    nameEn: "Storybook",
    build: (s) =>
      `中国传统儿童绘本插画风格，色彩明亮温暖，卡通可爱，适合3-8岁儿童，` +
      `${s.scene}，${s.elements.join("、")}，${s.timeLight}，${s.mood}的氛围，` +
      `画面干净清晰。${NEGATIVE}`,
  },
];

// 用 DeepSeek 从诗词/话题中抽取画面要素（JSON模式）
// 输出统一为中文要素（生图模型对中文提示词友好），用户可用任意语言提问
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
            "你是画面设计师。用户可能用中文或英文描述诗词/传统文化主题，你需要抽取适合作画的场景要素，只输出中文JSON：" +
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
