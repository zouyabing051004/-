// 智能体专属记忆：登录用户存 Supabase（跨设备），游客存 localStorage（不出设备）
// 一对一定制的机制：
//   1. 每次提问命中的节气/诗词沉淀为 recent_topics（滚动5条）
//   2. 同一话题出现 ≥2 次自动升级为 interests（兴趣标签）
//   3. 学过的诗记入 learned_poems，收藏的诗记入 favorite_poems
//   4. 这些记忆注入系统提示词，让知节"认得"每个孩子
import { supabase } from "@/db/supabase";
import { solarTerms } from "@/data/solarTerms";
import { searchPoems } from "@/data/poetryLibrary";
import type { AgentLanguage } from "./cultureAgent";

export interface AgentMemory {
  nickname?: string;
  language: AgentLanguage;
  interests: string[];
  favoritePoems: { id: string; title: string }[];
  learnedPoems: string[];
  recentTopics: string[];
  qaCount: number;
}

export const EMPTY_MEMORY: AgentMemory = {
  language: "zh",
  interests: [],
  favoritePoems: [],
  learnedPoems: [],
  recentTopics: [],
  qaCount: 0,
};

const LS_KEY = "culture-agent-memory";
// 话题出现次数（用于兴趣沉淀），游客与登录用户都记在本地即可
const LS_TOPIC_COUNT = "culture-agent-topic-count";

function normalize(raw: Partial<AgentMemory> | null | undefined): AgentMemory {
  if (!raw) return { ...EMPTY_MEMORY };
  return {
    nickname: typeof raw.nickname === "string" ? raw.nickname : undefined,
    language:
      raw.language === "en" || raw.language === "bilingual" ? raw.language : "zh",
    interests: Array.isArray(raw.interests) ? raw.interests.slice(0, 8).map(String) : [],
    favoritePoems: Array.isArray(raw.favoritePoems)
      ? raw.favoritePoems.filter((p) => p && p.id && p.title).slice(0, 20)
      : [],
    learnedPoems: Array.isArray(raw.learnedPoems) ? raw.learnedPoems.slice(0, 50).map(String) : [],
    recentTopics: Array.isArray(raw.recentTopics) ? raw.recentTopics.slice(0, 5).map(String) : [],
    qaCount: typeof raw.qaCount === "number" ? raw.qaCount : 0,
  };
}

function loadLocal(): AgentMemory {
  try {
    return normalize(JSON.parse(localStorage.getItem(LS_KEY) || "null"));
  } catch {
    return { ...EMPTY_MEMORY };
  }
}

function saveLocal(m: AgentMemory): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(m));
  } catch {
    // 隐私模式等场景忽略
  }
}

// ---------- 云端读写（登录用户） ----------

export async function loadMemory(userId: string | null): Promise<AgentMemory> {
  if (!userId) return loadLocal();
  try {
    const { data } = await supabase
      .from("user_agent_memory")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      return normalize({
        nickname: data.nickname ?? undefined,
        language: data.language,
        interests: data.interests,
        favoritePoems: data.favorite_poems,
        learnedPoems: data.learned_poems,
        recentTopics: data.recent_topics,
        qaCount: data.qa_count,
      });
    }
    // 首次登录：把游客本地记忆升级为云端记忆（无缝衔接）
    const local = loadLocal();
    await saveMemory(userId, local);
    return local;
  } catch {
    // 表未就绪（迁移 00007 未执行）时退回本地，功能不中断
    return loadLocal();
  }
}

export async function saveMemory(userId: string | null, m: AgentMemory): Promise<void> {
  saveLocal(m); // 本地始终留一份，作为离线兜底
  if (!userId) return;
  try {
    await supabase.from("user_agent_memory").upsert({
      user_id: userId,
      nickname: m.nickname ?? null,
      language: m.language,
      interests: m.interests,
      favorite_poems: m.favoritePoems,
      learned_poems: m.learnedPoems,
      recent_topics: m.recentTopics,
      qa_count: m.qaCount,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // 云端失败不影响使用
  }
}

// ---------- 从一次提问中沉淀记忆 ----------

export function absorbMessage(memory: AgentMemory, message: string): AgentMemory {
  const topics: string[] = [];
  for (const t of solarTerms) {
    if (message.includes(t.name)) topics.push(t.name);
  }
  const poems = searchPoems(message, 2);
  for (const p of poems) topics.push(`《${p.title}》`);

  // 自称检测：孩子说"我叫XX / 叫我XX"
  const nameMatch = message.match(/(?:我叫|叫我|我是|my name is\s+)([一-龥A-Za-z]{1,12})/i);
  const nickname = nameMatch ? nameMatch[1] : memory.nickname;

  // 兴趣沉淀：同一话题出现 ≥2 次
  let counts: Record<string, number> = {};
  try {
    counts = JSON.parse(localStorage.getItem(LS_TOPIC_COUNT) || "{}");
  } catch {
    counts = {};
  }
  const interests = [...memory.interests];
  for (const t of topics) {
    counts[t] = (counts[t] ?? 0) + 1;
    if (counts[t] >= 2 && !interests.includes(t)) interests.push(t);
  }
  try {
    localStorage.setItem(LS_TOPIC_COUNT, JSON.stringify(counts));
  } catch {
    // ignore
  }

  const learnedPoems = [...memory.learnedPoems];
  for (const p of poems) {
    if (!learnedPoems.includes(p.title)) learnedPoems.push(p.title);
  }

  return {
    ...memory,
    nickname,
    interests: interests.slice(0, 8),
    learnedPoems: learnedPoems.slice(0, 50),
    recentTopics: [...topics, ...memory.recentTopics.filter((t) => !topics.includes(t))].slice(0, 5),
    qaCount: memory.qaCount + 1,
  };
}

export function toggleFavorite(memory: AgentMemory, poem: { id: string; title: string }): AgentMemory {
  const exists = memory.favoritePoems.some((p) => p.id === poem.id);
  return {
    ...memory,
    favoritePoems: exists
      ? memory.favoritePoems.filter((p) => p.id !== poem.id)
      : [...memory.favoritePoems, poem].slice(0, 20),
  };
}

// 注入系统提示词的记忆摘要
export function memoryForPrompt(m: AgentMemory): string {
  const parts: string[] = [];
  if (m.nickname) parts.push(`用户希望被称呼为"${m.nickname}"。`);
  if (m.interests.length) parts.push(`TA 感兴趣的话题：${m.interests.join("、")}。可以主动关联这些兴趣举例。`);
  if (m.favoritePoems.length)
    parts.push(`TA 收藏的诗：${m.favoritePoems.map((p) => `《${p.title}》`).join("、")}。`);
  if (m.recentTopics.length) parts.push(`最近聊过：${m.recentTopics.join("、")}。可以自然衔接，但不要每句都提。`);
  if (m.qaCount >= 10) parts.push(`TA 已经和你聊过 ${m.qaCount} 次，是老朋友了，可以更亲昵。`);
  return parts.join("\n");
}
