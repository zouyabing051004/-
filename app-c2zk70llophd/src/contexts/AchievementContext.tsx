import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

/* ══════════════════════════════════════════
   成就徽章定义
══════════════════════════════════════════ */
export interface Badge {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  season?: string;
  type: "term" | "streak" | "complete";
  color: string;           // tailwind bg token (static string)
  glowColor: string;       // CSS hex
}

/* 24节气徽章 */
const SEASON_META: Record<string, { emoji: string; color: string; glow: string }> = {
  春: { emoji: "🌸", color: "bg-[#FFE8DE]", glow: "#FF8C69" },
  夏: { emoji: "🌿", color: "bg-[#DFF7F5]", glow: "#4ECDC4" },
  秋: { emoji: "🍂", color: "bg-[#FFF3E0]", glow: "#E8A87C" },
  冬: { emoji: "❄️", color: "bg-[#E3F4FF]", glow: "#87CEEB" },
};

const TERM_NAMES: Array<{ id: string; name: string; season: string }> = [
  { id: "lichun",   name: "立春", season: "春" },
  { id: "yushui",   name: "雨水", season: "春" },
  { id: "jingzhe",  name: "惊蛰", season: "春" },
  { id: "chunfen",  name: "春分", season: "春" },
  { id: "qingming", name: "清明", season: "春" },
  { id: "guyu",     name: "谷雨", season: "春" },
  { id: "lixia",    name: "立夏", season: "夏" },
  { id: "xiaoman",  name: "小满", season: "夏" },
  { id: "mangzhong",name: "芒种", season: "夏" },
  { id: "xiazhi",   name: "夏至", season: "夏" },
  { id: "xiaoshu",  name: "小暑", season: "夏" },
  { id: "dashu",    name: "大暑", season: "夏" },
  { id: "liqiu",    name: "立秋", season: "秋" },
  { id: "chushu",   name: "处暑", season: "秋" },
  { id: "bailu",    name: "白露", season: "秋" },
  { id: "qiufen",   name: "秋分", season: "秋" },
  { id: "hanlu",    name: "寒露", season: "秋" },
  { id: "shuangjiang", name: "霜降", season: "秋" },
  { id: "lidong",   name: "立冬", season: "冬" },
  { id: "xiaoxue",  name: "小雪", season: "冬" },
  { id: "daxue",    name: "大雪", season: "冬" },
  { id: "dongzhi",  name: "冬至", season: "冬" },
  { id: "xiaohan",  name: "小寒", season: "冬" },
  { id: "dahan",    name: "大寒", season: "冬" },
];

export const TERM_BADGES: Badge[] = TERM_NAMES.map(({ id, name, season }) => {
  const meta = SEASON_META[season];
  return {
    id: `term_${id}`,
    name,
    desc: `探索了${name}节气的奥秘！`,
    emoji: meta.emoji,
    season,
    type: "term",
    color: meta.color,
    glowColor: meta.glow,
  };
});

/* 连续学习里程碑徽章 */
export const STREAK_BADGES: Badge[] = [
  { id: "streak_3",  name: "小学者",       desc: "连续学习3天！",   emoji: "📚", type: "streak", color: "bg-[#F0F8FF]", glowColor: "#6BB5F0" },
  { id: "streak_7",  name: "节气迷",       desc: "连续学习7天！",   emoji: "🌟", type: "streak", color: "bg-[#FFF8E7]", glowColor: "#FFD700" },
  { id: "streak_14", name: "文化探索家",   desc: "连续学习14天！",  emoji: "🏆", type: "streak", color: "bg-[#FFF0F5]", glowColor: "#FF69B4" },
  { id: "streak_24", name: "节气达人",     desc: "连续学习24天！",  emoji: "👑", type: "streak", color: "bg-[#F5F0FF]", glowColor: "#9B59B6" },
  { id: "complete",  name: "廿四节气大师", desc: "解锁全部24个节气徽章！", emoji: "🎊", type: "complete", color: "bg-[#FFF9E6]", glowColor: "#FF8C00" },
];

export const ALL_BADGES: Badge[] = [...TERM_BADGES, ...STREAK_BADGES];

/* ══════════════════════════════════════════
   本地存储结构
══════════════════════════════════════════ */
interface StorageData {
  unlockedBadgeIds: string[];
  viewedTermIds: string[];
  streak: number;
  lastLearnDate: string;   // "YYYY-MM-DD"
}

const STORAGE_KEY = "sissy_achievements_v1";

function loadStorage(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StorageData;
  } catch { /* ignore */ }
  return { unlockedBadgeIds: [], viewedTermIds: [], streak: 0, lastLearnDate: "" };
}

function saveStorage(data: StorageData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/* ══════════════════════════════════════════
   Context
══════════════════════════════════════════ */
export interface CelebrationPayload {
  badge: Badge;
  isNew: boolean;
}

interface AchievementCtx {
  unlockedIds: Set<string>;
  viewedTermIds: Set<string>;
  streak: number;
  totalTerms: number;
  /** 调用此函数记录学习一个节气（传 termId 如 "lichun"） */
  recordLearn: (termId: string) => void;
  /** 待播放的庆祝队列（消费后请调用 dismissCelebration）*/
  celebration: CelebrationPayload | null;
  dismissCelebration: () => void;
}

const Ctx = createContext<AchievementCtx | null>(null);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StorageData>(loadStorage);
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);
  const queueRef = useRef<CelebrationPayload[]>([]);
  const playingRef = useRef(false);

  /* 持久化 */
  useEffect(() => { saveStorage(data); }, [data]);

  /* 庆祝队列播放 */
  const processQueue = useCallback(() => {
    if (playingRef.current || queueRef.current.length === 0) return;
    playingRef.current = true;
    setCelebration(queueRef.current.shift()!);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
    playingRef.current = false;
    setTimeout(processQueue, 200);
  }, [processQueue]);

  const enqueue = useCallback((payload: CelebrationPayload) => {
    queueRef.current.push(payload);
    processQueue();
  }, [processQueue]);

  /* 核心：记录学习 */
  const recordLearn = useCallback((termId: string) => {
    setData(prev => {
      const newUnlocked = new Set(prev.unlockedBadgeIds);
      const newViewed   = new Set(prev.viewedTermIds);
      const newBadges: CelebrationPayload[] = [];

      // 节气徽章
      const badgeId = `term_${termId}`;
      const isFirstVisit = !newViewed.has(termId);
      if (isFirstVisit) {
        newViewed.add(termId);
        if (!newUnlocked.has(badgeId)) {
          newUnlocked.add(badgeId);
          const badge = TERM_BADGES.find(b => b.id === badgeId);
          if (badge) newBadges.push({ badge, isNew: true });
        }
      }

      // 更新 streak
      const today = todayStr();
      let streak = prev.streak;
      const last  = prev.lastLearnDate;
      const lastDate = last ? new Date(last) : null;
      const todayDate = new Date(today);
      let newLastLearnDate = prev.lastLearnDate;

      if (last !== today) {
        newLastLearnDate = today;
        if (lastDate) {
          const diff = Math.round((todayDate.getTime() - lastDate.getTime()) / 86400000);
          streak = diff === 1 ? streak + 1 : 1;
        } else {
          streak = 1;
        }
      }

      // 连续学习徽章
      const streakMilestones = [
        { days: 3, id: "streak_3" }, { days: 7, id: "streak_7" },
        { days: 14, id: "streak_14" }, { days: 24, id: "streak_24" },
      ];
      for (const { days, id } of streakMilestones) {
        if (streak >= days && !newUnlocked.has(id)) {
          newUnlocked.add(id);
          const badge = STREAK_BADGES.find(b => b.id === id);
          if (badge) newBadges.push({ badge, isNew: true });
        }
      }

      // 全部24节气
      const termCount = TERM_BADGES.filter(b => newUnlocked.has(b.id)).length;
      if (termCount === 24 && !newUnlocked.has("complete")) {
        newUnlocked.add("complete");
        const badge = STREAK_BADGES.find(b => b.id === "complete");
        if (badge) newBadges.push({ badge, isNew: true });
      }

      // 入队庆祝
      newBadges.forEach(p => enqueue(p));

      return {
        unlockedBadgeIds: Array.from(newUnlocked),
        viewedTermIds: Array.from(newViewed),
        streak,
        lastLearnDate: newLastLearnDate,
      };
    });
  }, [enqueue]);

  const value: AchievementCtx = {
    unlockedIds: new Set(data.unlockedBadgeIds),
    viewedTermIds: new Set(data.viewedTermIds),
    streak: data.streak,
    totalTerms: TERM_BADGES.filter(b => data.unlockedBadgeIds.includes(b.id)).length,
    recordLearn,
    celebration,
    dismissCelebration,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAchievement() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAchievement must be used inside AchievementProvider");
  return ctx;
}
