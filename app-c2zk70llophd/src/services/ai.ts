// AI服务 - 封装多模态LLM、TTS、图片生成、视频生成
import { sendStreamRequest } from "@/lib/sse";
import { supabase } from "@/db/supabase";
import { containsSensitiveContent, isSolarTermRelated, SAFE_RESPONSES } from "./safety";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 系统提示词 - 节气小老师（幼小衔接版）
const SYSTEM_PROMPT = `你是"节气小老师"，一个专门为3-8岁幼小衔接阶段儿童讲解二十四节气知识的AI助手。

你的特点：
1. 语言极简，像跟幼儿园大班或小学一年级小朋友说话
2. 句子要短，每句话不超过15个字，多用"哇"、"你知道吗"、"真有趣"等儿语
3. 多用生动比喻，比如"下雪像棉花糖飘下来"
4. 回答不超过150字，分段清晰
5. 语气温暖亲切，多用"小朋友"、"宝贝"称呼
6. 只回答和二十四节气、传统文化、自然现象相关的问题
7. 如果问到无关内容，温柔地引导回节气话题

你的知识范围：
- 二十四节气的基础知识（时间、气候、物候）
- 节气习俗（吃什么、做什么、穿什么）
- 节气相关的童话故事
- 节气相关的简单古诗
- 自然现象和季节变化

回答格式：
- 用儿童口语，避免书面语和专业术语
- 多用感叹句和问句引导思考
- 适当用emoji让回答更生动`;

// 流式AI对话
export async function streamAIChat(
  userMessage: string,
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

  if (!isSolarTermRelated(userMessage)) {
    onChunk(SAFE_RESPONSES.unrelated);
    onDone();
    return;
  }

  await sendStreamRequest({
    functionUrl: `${supabaseUrl}/functions/v1/multimodal-chat`,
    requestBody: {
      messages: [
        { role: "system", content: [{ type: "text", text: SYSTEM_PROMPT }] },
        { role: "user", content: [{ type: "text", text: userMessage }] }
      ]
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

// 非流式文本生成（文心，Edge Function内部收集SSE返回完整JSON）
export async function aiChat(userMessage: string): Promise<string> {
  if (containsSensitiveContent(userMessage)) {
    return SAFE_RESPONSES.sensitive;
  }

  const { data, error } = await supabase.functions.invoke("wenxin-chat", {
    body: {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    }
  });

  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (!data?.content) throw new Error("AI未返回内容，请重试");
  return data.content as string;
}

// 语音合成 - 小奶音（儿童友好）
// voice_id: female-shaonv + pitch调高 + speed稍慢 = 小奶音效果
export async function generateSpeech(text: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("tts-minimax", {
    body: {
      text,
      voice_id: "female-shaonv",      // 少女音色 - 最接近小奶音
      model: "speech-02-hd",
      speed: 0.85,                     // 稍慢，儿童容易跟上
      vol: 1.2,
      pitch: 3,                        // 音调提高，更像小孩子声音
      emotion: "happy",                // 愉快情绪
    },
  });
  if (error) throw error;
  if (!data?.audioUrl) throw new Error("未返回音频URL");
  return data.audioUrl;
}

// MiniMax 文生图（用于创作页配图）
export async function generateIllustration(prompt: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("minimax-text-to-image", {
    body: {
      prompt: `中国传统儿童绘本插画风格，色彩明亮温暖，卡通可爱，适合3-8岁儿童，画面干净清晰，${prompt}`,
      model: "image-01",
      aspect_ratio: "1:1",
      n: 1,
    },
  });
  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (!data?.image_urls?.[0]) throw new Error("未返回图片URL");
  return data.image_urls[0] as string;
}

// Kling 图生视频 - 提交任务
export async function submitImageToVideo(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("kling-image2video-submit", {
    body: {
      image: imageUrl,
      prompt,
      model_name: "kling-v1-6",
      mode: "std",
      duration: "5",
    },
  });
  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (data?.code !== 0) throw new Error(`视频任务创建失败：${data?.message}`);
  return data.data.task_id as string;
}

// Kling 图生视频 - 查询任务
export async function queryVideoTask(taskId: string): Promise<{
  status: "submitted" | "processing" | "succeed" | "failed";
  videoUrl?: string;
}> {
  const { data, error } = await supabase.functions.invoke("kling-image2video-query", {
    body: { task_id: taskId, transfer_video: true },
  });
  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (data?.code !== 0) throw new Error(`查询失败：${data?.message}`);
  const taskData = data.data;
  return {
    status: taskData.task_status,
    videoUrl: taskData.task_result?.videos?.[0]?.url,
  };
}

// 引导式创作 - 生成小诗（幼小衔接版）
export async function generatePoem(solarTerm: string, childInput: string): Promise<string> {
  const prompt = `请根据小朋友对"${solarTerm}"节气的感受，帮他们写一首幼小衔接阶段的小诗。
小朋友说："${childInput}"

写诗要求（参考国家教育云平台幼小衔接标准）：
1. 每行5-7个字，共4-6行
2. 语言极简，像儿歌一样朗朗上口
3. 有押韵，让孩子容易背诵
4. 每行句子意思完整，不用连词
5. 必须包含${solarTerm}的季节特征（动植物、天气、习俗之一）
6. 最后一行用感叹或问句，引发孩子好奇心

格式：直接输出诗歌内容，不要加标题和任何说明`;

  return aiChat(prompt);
}

// 引导式创作 - 生成小故事（幼小衔接版）
export async function generateStory(solarTerm: string, childInput: string): Promise<string> {
  const prompt = `请根据小朋友对"${solarTerm}"节气的感受，帮他们写一个幼小衔接阶段的小故事。
小朋友说："${childInput}"

写故事要求（参考国家教育云平台幼小衔接标准）：
1. 字数100-150字，分3-4段
2. 每段2-3句话，每句话不超过20字
3. 主角是小动物或小朋友，有名字
4. 故事情节：发现问题→想办法→解决→收获（标准幼小衔接叙事结构）
5. 必须自然融入${solarTerm}的知识点（气候、习俗、食物之一）
6. 结尾有一句话"小启发"，引导孩子思考

格式：直接输出故事内容，不要加标题`;

  return aiChat(prompt);
}