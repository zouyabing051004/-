import { useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Trophy, Flame, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAchievement,
  ALL_BADGES,
  TERM_BADGES,
  STREAK_BADGES,
  type Badge,
} from "@/contexts/AchievementContext";

gsap.registerPlugin(useGSAP);

/* ── 单枚徽章卡片 ── */
function BadgeTile({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  const tileRef = useRef<HTMLDivElement>(null);

  /* 解锁态入场 */
  useGSAP(() => {
    if (!unlocked || !tileRef.current) return;
    gsap.fromTo(tileRef.current,
      { scale: 0.7, autoAlpha: 0 },
      { scale: 1,   autoAlpha: 1, duration: 0.5, ease: "back.out(2)" }
    );
  }, { scope: tileRef, dependencies: [unlocked] });

  return (
    <div
      ref={tileRef}
      className={cn(
        "relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all",
        unlocked
          ? "bg-card border-border shadow-sm"
          : "bg-muted/40 border-dashed border-muted-foreground/20 opacity-60"
      )}
      style={unlocked ? { boxShadow: `0 0 12px ${badge.glowColor}40` } : {}}
    >
      {/* 徽章图标 */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2",
          unlocked ? "border-white shadow-md" : "border-muted-foreground/20 grayscale"
        )}
        style={unlocked
          ? { background: `radial-gradient(circle at 35% 35%, white, ${badge.glowColor}44)` }
          : { background: "hsl(var(--muted))" }
        }
      >
        {unlocked ? badge.emoji : <Lock className="w-4 h-4 text-muted-foreground/40" />}
      </div>
      {/* 名称 */}
      <p className={cn(
        "text-xs font-semibold text-center leading-tight text-balance",
        unlocked ? "text-foreground" : "text-muted-foreground/50"
      )}>
        {badge.name}
      </p>
      {/* 解锁光点 */}
      {unlocked && (
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ background: badge.glowColor }}
        />
      )}
    </div>
  );
}

/* ── streak 火焰计数器 ── */
function StreakCounter({ streak }: { streak: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(streak);

  useEffect(() => {
    if (streak !== prevRef.current && numRef.current) {
      gsap.fromTo(numRef.current,
        { scale: 1.6, color: "#FF8C00" },
        { scale: 1,   color: "inherit", duration: 0.5, ease: "back.out(2)" }
      );
    }
    prevRef.current = streak;
  }, [streak]);

  const flameSize = streak === 0 ? "text-2xl" : streak >= 7 ? "text-4xl" : "text-3xl";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={cn("select-none", flameSize)}>
        {streak === 0 ? "🌱" : streak >= 14 ? "🔥🔥" : "🔥"}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span ref={numRef} className="text-3xl font-bold text-foreground font-serif">{streak}</span>
        <span className="text-sm text-muted-foreground">天</span>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {streak === 0
          ? "开始学习节气吧！"
          : streak >= 24
          ? "你已是节气达人！🏆"
          : streak >= 14
          ? "太厉害了，快到24天！"
          : streak >= 7
          ? "连续一周，真棒！"
          : "坚持下去！加油🦌"}
      </p>
    </div>
  );
}

/* ── 进度条 ── */
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.min(100, (value / max) * 100);

  useGSAP(() => {
    if (!barRef.current) return;
    gsap.fromTo(barRef.current, { width: "0%" }, { width: `${pct}%`, duration: 0.9, ease: "power2.out", delay: 0.1 });
  }, { scope: barRef, dependencies: [pct] });

  return (
    <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
      <div
        ref={barRef}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   主页面
══════════════════════════════════════════ */
export default function AchievementPage() {
  const { lang } = useLanguage();
  const { unlockedIds, streak, totalTerms } = useAchievement();
  const headerRef = useRef<HTMLDivElement>(null);

  /* 页面入场 */
  useGSAP(() => {
    gsap.from(".ach-section", {
      y: 24, autoAlpha: 0, stagger: 0.1, duration: 0.45, ease: "power3.out"
    });
  }, { scope: headerRef });

  const streakNextMilestone =
    streak < 3  ? 3  :
    streak < 7  ? 7  :
    streak < 14 ? 14 :
    streak < 24 ? 24 : 24;

  return (
    <div ref={headerRef} className="pb-24 min-h-screen bg-background">

      {/* ── 顶部横幅 ── */}
      <div
        className="ach-section relative overflow-hidden px-5 pt-8 pb-6"
        style={{ background: "linear-gradient(135deg,#FF8C69,#E8A87C,#87CEEB)" }}
      >
        {/* 装饰波浪 */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 400 22"
          preserveAspectRatio="none" style={{ height: 22 }}>
          <path d="M0,11 C100,22 300,0 400,11 L400,22 L0,22 Z" fill="hsl(var(--background))" />
        </svg>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-serif text-balance">{lang === "en" ? "Sisi\u2019s Hall of Badges" : "四四成就馆"}</h1>
            <p className="text-white/80 text-sm">{lang === "en" ? "Explore the solar terms and unlock your badges!" : "探索节气，解锁专属徽章！"}</p>
          </div>
        </div>

        {/* 统计行 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🏅", value: unlockedIds.size, label: "已解锁", total: ALL_BADGES.length },
            { icon: "🌿", value: totalTerms, label: "节气探索", total: 24 },
            { icon: "🔥", value: streak, label: "连续天数", total: null },
          ].map(({ icon, value, label, total }) => (
            <div key={label}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center text-center">
              <span className="text-xl mb-0.5">{icon}</span>
              <p className="text-xl font-bold text-white leading-none">
                {value}{total !== null ? <span className="text-sm text-white/70">/{total}</span> : ""}
              </p>
              <p className="text-xs text-white/75 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">

        {/* ── 连续学习 ── */}
        <section className="ach-section bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-foreground text-base">连续学习</h2>
          </div>
          <div className="flex items-center gap-6">
            <StreakCounter streak={streak} />
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>距离下个里程碑</span>
                  <span>{Math.min(streak, streakNextMilestone)}/{streakNextMilestone}天</span>
                </div>
                <ProgressBar value={streak} max={streakNextMilestone} color="#FF8C00" />
              </div>
              {/* 连续徽章行 */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {STREAK_BADGES.filter(b => b.type === "streak").map(badge => (
                  <div key={badge.id} className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl border-2",
                        unlockedIds.has(badge.id)
                          ? "border-white shadow-md"
                          : "border-dashed border-muted-foreground/25 grayscale opacity-50"
                      )}
                      style={unlockedIds.has(badge.id)
                        ? { background: `radial-gradient(circle,white,${badge.glowColor}44)` }
                        : { background: "hsl(var(--muted))" }
                      }
                    >
                      {unlockedIds.has(badge.id) ? badge.emoji : <Lock className="w-3 h-3 text-muted-foreground/30" />}
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground leading-tight">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 节气探索进度 ── */}
        <section className="ach-section bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-foreground text-base">节气徽章</h2>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {totalTerms}<span className="text-muted-foreground/60">/24</span>
            </span>
          </div>
          <ProgressBar value={totalTerms} max={24} color="#FF8C69" />

          {/* 四季分组 */}
          {(["春", "夏", "秋", "冬"] as const).map(season => {
            const seasonBadges = TERM_BADGES.filter(b => b.season === season);
            const seasonUnlocked = seasonBadges.filter(b => unlockedIds.has(b.id)).length;
            const meta = { 春: { emoji: "🌸", glow: "#FF8C69" }, 夏: { emoji: "🌿", glow: "#4ECDC4" }, 秋: { emoji: "🍂", glow: "#E8A87C" }, 冬: { emoji: "❄️", glow: "#87CEEB" } }[season];
            return (
              <div key={season} className="mt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">{meta.emoji}</span>
                  <span className="text-sm font-semibold text-foreground">{season}季</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {seasonUnlocked}/{seasonBadges.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                  {seasonBadges.map(badge => (
                    <BadgeTile key={badge.id} badge={badge} unlocked={unlockedIds.has(badge.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* ── 大师徽章 ── */}
        <section className="ach-section bg-card border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎊</span>
            <h2 className="font-bold text-foreground text-base">大师徽章</h2>
          </div>
          {(() => {
            const badge = STREAK_BADGES.find(b => b.id === "complete")!;
            const unlocked = unlockedIds.has("complete");
            return (
              <div className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border",
                unlocked ? "bg-[#FFF9E6] border-[#FFD700]/40" : "bg-muted/30 border-dashed border-muted-foreground/20"
              )}>
                <div
                  className={cn("w-16 h-16 rounded-full flex items-center justify-center text-4xl border-3",
                    unlocked ? "border-[#FFD700] shadow-lg" : "border-dashed border-muted-foreground/20 grayscale opacity-40")}
                  style={unlocked ? { background: `radial-gradient(circle,white,${badge.glowColor}55)`, boxShadow: `0 0 24px ${badge.glowColor}60` } : {}}
                >
                  {unlocked ? badge.emoji : <Lock className="w-6 h-6 text-muted-foreground/30" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-bold text-base text-balance", unlocked ? "text-foreground" : "text-muted-foreground/50")}>{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 text-pretty">{badge.desc}</p>
                  {!unlocked && (
                    <div className="mt-2">
                      <ProgressBar value={totalTerms} max={24} color="#FFD700" />
                      <p className="text-xs text-muted-foreground mt-1">还差 {24 - totalTerms} 个节气</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </section>

      </div>
    </div>
  );
}
