import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, ChevronRight, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { solarTerms } from "@/data/solarTerms";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";

/* ── 底部 Tab 繁琐彩色 SVG 图标（小孩风格：多层渐变+光晕+花纹+星星）── */
const TabIconHome = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
    <defs>
      <linearGradient id="home-roof" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={active ? "#4ade80" : "#86efac"}/>
        <stop offset="100%" stopColor={active ? "#16a34a" : "#22c55e"}/>
      </linearGradient>
      <linearGradient id="home-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={active ? "#bbf7d0" : "#d1fae5"}/>
        <stop offset="100%" stopColor={active ? "#86efac" : "#a7f3d0"}/>
      </linearGradient>
    </defs>
    {/* 屋顶 */}
    <path d="M16 3L2 14h4v14h7v-7h6v7h7V14h4L16 3z" fill="url(#home-roof)"/>
    {/* 屋顶高光 */}
    <path d="M16 3L8 10 16 7 24 10 16 3z" fill="#fff" opacity="0.25"/>
    {/* 墙体 */}
    <rect x="9" y="14" width="14" height="14" rx="1" fill="url(#home-wall)"/>
    {/* 窗户 */}
    <rect x="10" y="15" width="5" height="5" rx="1.5" fill="#7dd3fc"/>
    <rect x="17" y="15" width="5" height="5" rx="1.5" fill="#7dd3fc"/>
    <line x1="12.5" y1="15" x2="12.5" y2="20" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
    <line x1="10" y1="17.5" x2="15" y2="17.5" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
    <line x1="19.5" y1="15" x2="19.5" y2="20" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
    <line x1="17" y1="17.5" x2="22" y2="17.5" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
    {/* 门 */}
    <rect x="13" y="21" width="6" height="7" rx="3" fill="#b45309"/>
    <circle cx="17.5" cy="24.5" r="0.8" fill="#fbbf24"/>
    {/* 烟囱 */}
    <rect x="20" y="8" width="3" height="5" rx="1" fill="#d97706"/>
    <ellipse cx="21.5" cy="8" rx="2" ry="1" fill="#b45309"/>
    {/* 烟 */}
    <path d="M21 6 Q22 4 21 2" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6"/>
    {/* 小花装饰 */}
    <circle cx="4" cy="20" r="2" fill="#fb7185" opacity="0.7"/>
    <circle cx="4" cy="20" r="1" fill="#fff" opacity="0.8"/>
    <circle cx="28" cy="20" r="2" fill="#fb7185" opacity="0.7"/>
    <circle cx="28" cy="20" r="1" fill="#fff" opacity="0.8"/>
    {/* 星星 */}
    <path d="M27 5 l0.7 1.4 1.5 0 -1.2 1 0.5 1.6-1.5-1-1.5 1 0.5-1.6-1.2-1 1.5 0z" fill="#fbbf24" opacity="0.85"/>
  </svg>
);
const TabIconSolar = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
    <defs>
      <radialGradient id="sun-grad" cx="40%" cy="35%">
        <stop offset="0%" stopColor={active ? "#fde68a" : "#fef3c7"}/>
        <stop offset="100%" stopColor={active ? "#f59e0b" : "#fbbf24"}/>
      </radialGradient>
      <radialGradient id="tree-grad" cx="50%" cy="30%">
        <stop offset="0%" stopColor={active ? "#4ade80" : "#86efac"}/>
        <stop offset="100%" stopColor={active ? "#15803d" : "#16a34a"}/>
      </radialGradient>
    </defs>
    {/* 太阳 */}
    <circle cx="22" cy="8" r="6" fill="url(#sun-grad)"/>
    <circle cx="22" cy="8" r="3.5" fill="#fbbf24"/>
    <circle cx="22" cy="8" r="2" fill="#fef9c3"/>
    {/* 光芒 */}
    {[0,45,90,135,180,225,270,315].map((a,i) => (
      <line key={i}
        x1={22 + Math.cos(a*Math.PI/180)*4.5} y1={8 + Math.sin(a*Math.PI/180)*4.5}
        x2={22 + Math.cos(a*Math.PI/180)*6.5} y2={8 + Math.sin(a*Math.PI/180)*6.5}
        stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round"/>
    ))}
    {/* 节气树干 */}
    <rect x="14" y="24" width="4" height="7" rx="2" fill="#92400e"/>
    <line x1="14" y1="27" x2="11" y2="24" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="26" x2="21" y2="23" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 树冠三层 */}
    <ellipse cx="16" cy="23" rx="8" ry="5" fill="url(#tree-grad)"/>
    <ellipse cx="16" cy="19" rx="6" ry="4.5" fill={active ? "#22c55e" : "#4ade80"}/>
    <ellipse cx="16" cy="15" rx="4.5" ry="4" fill={active ? "#16a34a" : "#22c55e"}/>
    {/* 树上小果子 */}
    <circle cx="13" cy="20" r="1.2" fill="#fb7185"/>
    <circle cx="19" cy="21" r="1.2" fill="#fb7185"/>
    <circle cx="16" cy="16" r="1" fill="#fbbf24"/>
    {/* 高光 */}
    <ellipse cx="13" cy="20" rx="2" ry="1" fill="#fff" opacity="0.25" transform="rotate(-20 13 20)"/>
    {/* 地面小草 */}
    <path d="M6 30 Q7 27 8 30" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M9 30 Q10 26 11 30" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);
const TabIconPoetry = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
    <defs>
      <linearGradient id="book-cover" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={active ? "#818cf8" : "#a5b4fc"}/>
        <stop offset="100%" stopColor={active ? "#4f46e5" : "#6366f1"}/>
      </linearGradient>
      <linearGradient id="book-spine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={active ? "#3730a3" : "#4338ca"}/>
        <stop offset="100%" stopColor={active ? "#4f46e5" : "#6366f1"}/>
      </linearGradient>
    </defs>
    {/* 书本封面 */}
    <rect x="6" y="4" width="20" height="24" rx="3" fill="url(#book-cover)"/>
    {/* 书脊 */}
    <rect x="6" y="4" width="5" height="24" rx="2.5" fill="url(#book-spine)"/>
    {/* 书页侧面 */}
    <rect x="22" y="5" width="3" height="22" rx="1" fill="#e0e7ff" opacity="0.5"/>
    {/* 封面装饰花纹 */}
    <rect x="13" y="7" width="10" height="1.5" rx="0.75" fill="#fff" opacity="0.5"/>
    {/* 文字行 */}
    <rect x="12" y="12" width="11" height="1.8" rx="0.9" fill="#fff" opacity="0.85"/>
    <rect x="12" y="16" width="11" height="1.8" rx="0.9" fill="#fff" opacity="0.85"/>
    <rect x="12" y="20" width="8" height="1.8" rx="0.9" fill="#fff" opacity="0.85"/>
    {/* 书签 */}
    <rect x="20" y="4" width="2.5" height="8" rx="1.25" fill="#fb7185"/>
    <path d="M20 12 L21.25 10.5 L22.5 12" fill="#fb7185"/>
    {/* 闪光星星 */}
    <path d="M5 6 l0.6 1.2 1.3 0 -1 0.9 0.4 1.4L5 8.8 3.7 9.5l0.4-1.4-1-.9 1.3 0z" fill="#fbbf24"/>
    <circle cx="26" cy="28" r="1.5" fill="#fbbf24" opacity="0.7"/>
    <circle cx="5" cy="27" r="1" fill="#fb7185" opacity="0.6"/>
    {/* 小花 */}
    <circle cx="28" cy="5" r="2" fill="#f9a8d4" opacity="0.7"/>
    <circle cx="28" cy="5" r="1" fill="#fff" opacity="0.8"/>
  </svg>
);
const TabIconAchieve = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
    <defs>
      <linearGradient id="cup-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={active ? "#fde68a" : "#fef3c7"}/>
        <stop offset="100%" stopColor={active ? "#d97706" : "#f59e0b"}/>
      </linearGradient>
      <linearGradient id="cup-handle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={active ? "#b45309" : "#d97706"}/>
        <stop offset="100%" stopColor={active ? "#d97706" : "#f59e0b"}/>
      </linearGradient>
    </defs>
    {/* 奖杯主体 */}
    <path d="M10 4h12v11a6 6 0 01-12 0V4z" fill="url(#cup-grad)"/>
    {/* 奖杯高光 */}
    <path d="M11 5h4v9a3 3 0 01-4-2.8V5z" fill="#fff" opacity="0.2"/>
    <ellipse cx="14" cy="6" rx="3" ry="1.5" fill="#fff" opacity="0.3"/>
    {/* 把手左 */}
    <path d="M10 6H6Q3 6 3 10Q3 14 7 14h3" stroke="url(#cup-handle)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* 把手右 */}
    <path d="M22 6h4Q29 6 29 10Q29 14 25 14h-3" stroke="url(#cup-handle)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* 茎 */}
    <rect x="14" y="19" width="4" height="5" rx="2" fill="#b45309"/>
    {/* 底座 */}
    <rect x="9" y="24" width="14" height="3.5" rx="1.75" fill={active ? "#b45309" : "#d97706"}/>
    <rect x="11" y="23" width="10" height="2" rx="1" fill={active ? "#92400e" : "#b45309"}/>
    {/* 杯内星星 */}
    <path d="M16 8 l0.8 1.6 1.8 0 -1.4 1.2 0.5 1.8-1.7-1.1-1.7 1.1 0.5-1.8-1.4-1.2 1.8 0z" fill="#fff" opacity="0.85"/>
    {/* 光芒环绕 */}
    <path d="M7 3 l0.5 1 1 0 -0.8 0.7 0.3 1.1-1-.7-1 .7.3-1.1-.8-.7 1 0z" fill="#fbbf24" opacity="0.9"/>
    <path d="M25 3 l0.5 1 1 0 -0.8 0.7 0.3 1.1-1-.7-1 .7.3-1.1-.8-.7 1 0z" fill="#fbbf24" opacity="0.9"/>
    <path d="M16 2 l0.4 0.8 0.8 0 -0.6 0.6 0.2 0.9-.8-.6-.8.6.2-.9-.6-.6.8 0z" fill="#fbbf24"/>
    {/* 飘彩带 */}
    <path d="M5 20 Q3 18 4 16 Q6 18 5 20Z" fill="#fb7185" opacity="0.7"/>
    <path d="M27 20 Q29 18 28 16 Q26 18 27 20Z" fill="#4ade80" opacity="0.7"/>
    {/* 小圆点装饰 */}
    <circle cx="6" cy="22" r="1.2" fill="#fbbf24" opacity="0.6"/>
    <circle cx="26" cy="22" r="1.2" fill="#fbbf24" opacity="0.6"/>
  </svg>
);

const TabIconAgent = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
    <defs>
      <linearGradient id="agent-face" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={active ? "#4ade80" : "#86efac"}/>
        <stop offset="100%" stopColor={active ? "#15803d" : "#22c55e"}/>
      </linearGradient>
    </defs>
    {/* 圆脸 */}
    <circle cx="16" cy="17" r="11" fill="url(#agent-face)"/>
    {/* 天线 */}
    <rect x="15" y="3" width="2" height="4" rx="1" fill={active ? "#15803d" : "#22c55e"}/>
    <circle cx="16" cy="3" r="2" fill="#fbbf24"/>
    {/* 眼睛 */}
    <circle cx="12" cy="16" r="1.8" fill="#fff"/>
    <circle cx="20" cy="16" r="1.8" fill="#fff"/>
    {/* 微笑 */}
    <path d="M12 21 Q16 24 20 21" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    {/* 星光 */}
    <circle cx="26" cy="8" r="1.2" fill="#fbbf24" opacity="0.8"/>
  </svg>
);

/* ── 底部导航 Tab 配置（深绿填充图标）── */
const bottomTabs = [
  { name: "首页",  path: "/",                    Icon: TabIconHome,    activeKey: "/" },
  { name: "节气",  path: "/solar-term/lichun",   Icon: TabIconSolar,   activeKey: "/solar-term" },
  { name: "AI伙伴", path: "/culture",            Icon: TabIconAgent,   activeKey: "/culture" },
  { name: "诗词",  path: "/poetry",              Icon: TabIconPoetry,  activeKey: "/poetry" },
  { name: "成就",  path: "/achievement",         Icon: TabIconAchieve, activeKey: "/achievement" },
];

/* ── 底部导航栏（参考图：白色胶囊，激活圆形绿底）── */
function BottomNav() {
  const location = useLocation();
  const [lastTapped, setLastTapped] = useState<string | null>(null);

  const isActive = (tab: typeof bottomTabs[number]) => {
    if (tab.activeKey === "/") return location.pathname === "/";
    return location.pathname.startsWith(tab.activeKey);
  };

  const handleTap = (path: string) => {
    setLastTapped(path);
    setTimeout(() => setLastTapped(null), 400);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div
        className="mx-4 mb-3 rounded-[2.5rem]"
        style={{
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 4px 32px rgba(91,168,131,0.22), 0 1px 6px rgba(91,168,131,0.12)",
          border: "1.5px solid rgba(255,255,255,0.95)",
        }}
      >
        <div className="flex items-center justify-around px-3" style={{ height: 88 }}>
          {bottomTabs.map((tab) => {
            const active = isActive(tab);
            const tapped = lastTapped === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => handleTap(tab.path)}
                className="flex flex-col items-center justify-center gap-1"
                style={{ minWidth: 72, minHeight: 72 }}
                aria-label={tab.name}
              >
                {/* 图标容器（激活绿色圆形底）*/}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-300",
                    tapped && "animate-marshmallow",
                  )}
                  style={{
                    width: 56, height: 56,
                    background: active ? "#5BA883" : "transparent",
                    boxShadow: active ? "0 2px 10px rgba(91,168,131,0.35)" : "none",
                  }}
                >
                  <tab.Icon active={active} />
                </div>
                {/* 标签文字 */}
                <span
                  className="font-semibold leading-none transition-colors duration-200"
                  style={{ fontSize: 13, color: active ? "#5BA883" : "#8aab96" }}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ── 季节配置（下拉菜单）── */
const SEASON_DROPDOWN = [
  { season: "春" as const, label: "🌱 春季", color: "text-[#3d8c5a]", bg: "hover:bg-[#e8f5ec]" },
  { season: "夏" as const, label: "☀️ 夏季", color: "text-[#2a8c86]", bg: "hover:bg-[#e8f9f7]" },
  { season: "秋" as const, label: "🍂 秋季", color: "text-[#a06020]", bg: "hover:bg-[#fdf3e3]" },
  { season: "冬" as const, label: "❄️ 冬季", color: "text-[#2a6a8c]", bg: "hover:bg-[#e8f4ff]" },
];

function SolarTermDropdown() {
  const [open, setOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setActiveSeason(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAll = () => { setOpen(false); setActiveSeason(null); };

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1 px-5 py-2 rounded-full text-base font-semibold transition-all whitespace-nowrap",
          open
            ? "bg-white text-[#2a6e48] shadow-sm"
            : "text-white/90 hover:bg-white/20"
        )}
      >
        节气科普
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-50 flex rounded-2xl overflow-hidden border border-white/80 mt-2"
          style={{ boxShadow: "0 8px 32px rgba(91,168,131,0.18)" }}
          onMouseLeave={() => { setOpen(false); setActiveSeason(null); }}
        >
          <div className="bg-white w-36 py-2">
            {SEASON_DROPDOWN.map(({ season, label, color, bg }) => (
              <button
                key={season}
                onMouseEnter={() => setActiveSeason(season)}
                onClick={() => setActiveSeason(s => s === season ? null : season)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors",
                  color, bg, activeSeason === season && "bg-muted"
                )}
              >
                <span>{label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
          {activeSeason && (
            <div className="bg-white w-40 py-2 border-l border-border/30">
              {solarTerms
                .filter(t => t.season === activeSeason)
                .map(term => (
                  <Link
                    key={term.id}
                    to={`/solar-term/${term.id}`}
                    onClick={closeAll}
                    className="flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{term.name}</span>
                    <span className="text-xs text-muted-foreground">{term.month}/{term.day}</span>
                  </Link>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 顶部横向导航（桌面）── */
const navItems = [
  { name: "首页",     path: "/" },
  { name: "AI伙伴",   path: "/culture" },
  { name: "民间饮食", path: "/folk-food" },
  { name: "传统习俗", path: "/customs" },
  { name: "实景社区", path: "/community" },
  { name: "成就馆",   path: "/achievement" },
];

/* ── 季节侧边栏配置 ── */
const seasonConfig: Record<string, {
  label: string;
  textClass: string; dotClass: string; bgClass: string; headerBg: string;
}> = {
  春: { label: "🌱 春季", textClass: "text-[#3d8c5a]", dotClass: "bg-[#5BA883]", bgClass: "hover:bg-[#e8f5ec]", headerBg: "bg-[#e8f5ec]" },
  夏: { label: "☀️ 夏季", textClass: "text-[#2a8c86]", dotClass: "bg-[#4ECDC4]", bgClass: "hover:bg-[#e8f9f7]", headerBg: "bg-[#e8f9f7]" },
  秋: { label: "🍂 秋季", textClass: "text-[#a06020]", dotClass: "bg-[#F5C87A]", bgClass: "hover:bg-[#fdf3e3]", headerBg: "bg-[#fdf3e3]" },
  冬: { label: "❄️ 冬季", textClass: "text-[#2a6a8c]", dotClass: "bg-[#87CEEB]", bgClass: "hover:bg-[#e8f4ff]", headerBg: "bg-[#e8f4ff]" },
};
const seasons = ["春", "夏", "秋", "冬"] as const;

function SolarTermSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const currentTermId = location.pathname.startsWith("/solar-term/")
    ? location.pathname.split("/solar-term/")[1] : null;
  const currentSeason = solarTerms.find(t => t.id === currentTermId)?.season ?? "春";
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(seasons.map(s => [s, s === currentSeason]))
  );
  const toggle = (season: string) => setExpanded(prev => ({ ...prev, [season]: !prev[season] }));

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-primary/20">
            <img
              src="https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png"
              alt="四四" className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-foreground leading-snug tracking-wide">禾间识岁</h1>
            <p className="text-xs text-muted-foreground leading-tight">二十四节气儿童学习</p>
          </div>
        </Link>
        <div className="mt-3 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>

      <div className="px-3 pb-1 shrink-0">
        <p className="text-xs font-semibold text-muted-foreground tracking-widest px-1">二十四节气</p>
      </div>

      <ScrollArea className="flex-1 px-2 pb-4">
        {seasons.map((season) => {
          const cfg = seasonConfig[season];
          const terms = solarTerms.filter(t => t.season === season);
          const isExpanded = expanded[season];
          return (
            <div key={season} className="mb-1">
              <button
                onClick={() => toggle(season)}
                className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-colors text-left", cfg.headerBg)}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-bold tracking-wide", cfg.textClass)}>{cfg.label}</span>
                  <span className="text-xs text-muted-foreground">({terms.length})</span>
                </div>
                {isExpanded
                  ? <ChevronDown className={cn("w-4 h-4", cfg.textClass)} />
                  : <ChevronRight className={cn("w-4 h-4", cfg.textClass)} />}
              </button>
              {isExpanded && (
                <div className="mt-0.5 ml-2 space-y-0.5">
                  {terms.map(term => {
                    const isActiveItem = currentTermId === term.id;
                    return (
                      <Link
                        key={term.id} to={`/solar-term/${term.id}`} onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors",
                          isActiveItem ? "bg-primary/15 text-primary font-semibold" : cn("text-foreground", cfg.bgClass)
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={cn("w-2 h-2 rounded-full shrink-0", isActiveItem ? "bg-primary" : cfg.dotClass)} />
                          <span className="truncate">{term.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0 ml-1">{term.month}月{term.day}日</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </ScrollArea>

      <div className="px-4 py-3 border-t border-border/50 shrink-0">
        <p className="text-xs text-muted-foreground text-center">田间草木 · 识得岁时</p>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const isHome = location.pathname === "/";

  const isActiveNav = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("已退出登录");
    navigate("/", { replace: true });
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        backgroundImage: `url('https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260619/image_1781865766948.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* BgDecorations 已由背景图替代，保留占位以不破坏层叠 */}
      {/* ── 桌面侧边栏（非首页显示）── */}
      {!isHome && (
        <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-white/60"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
          <SolarTermSidebar />
        </aside>
      )}

      {/* ── 主区域 ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-x-hidden">

        {/* ── 桌面顶部导航（深绿色厚重胶囊横条，导航居中）── */}
        <header className="hidden lg:flex items-center px-4 py-2 shrink-0 sticky top-0 z-30 gap-3">
          <div
            className="flex items-center gap-3 w-full px-5 py-2 rounded-full"
            style={{
              background: "rgba(70,124,99,0.95)",
              boxShadow: "0 4px 20px rgba(40,90,60,0.28), 0 1px 4px rgba(40,90,60,0.18)",
              border: "2px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              minHeight: 62,
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/60 shadow-sm bg-white/90">
                <img
                  src="https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png"
                  alt="四四" className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-white text-lg tracking-wider whitespace-nowrap drop-shadow">禾间识岁</span>
            </Link>

            {/* 导航项 — 居中 */}
            <div className="flex items-center justify-center gap-1 flex-1">
              {navItems.map(({ name, path }) => {
                const active = isActiveNav(path);
                return (
                  <Link key={path} to={path}>
                    <div className={cn(
                      "px-5 py-2 rounded-full text-base font-semibold transition-all whitespace-nowrap",
                      active
                        ? "bg-white text-[#2a6e48] shadow-sm"
                        : "text-white/90 hover:bg-white/20"
                    )}>{name}</div>
                  </Link>
                );
              })}
              <SolarTermDropdown />
            </div>

            {/* 登录状态 */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  <span className="text-white/80 text-sm hidden xl:flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-full">
                    <UserIcon className="w-3.5 h-3.5" />
                    {profile?.username ?? user.email?.split("@")[0]}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-white hover:bg-white/20 rounded-full text-xs h-8 px-3 border border-white/30"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />退出
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full text-sm h-8 px-4 border border-white/30 font-semibold"
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />登录
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* ── 移动端顶栏 ── */}
        <header className="lg:hidden flex items-center justify-between px-4 py-2.5 shrink-0 sticky top-0 z-30 gap-2"
          style={{ background: "rgba(70,124,99,0.92)", backdropFilter: "blur(10px)" }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white/60 shadow-sm bg-white/90">
              <img
                src="https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png"
                alt="四四" className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-white text-lg tracking-wide drop-shadow">禾间识岁</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white hover:bg-white/20 rounded-full text-xs h-8 px-3 border border-white/30"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />退出
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full text-xs h-8 px-3 border border-white/30 font-semibold"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1" />登录
                </Button>
              </Link>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"
                  className="text-white hover:bg-white/20 rounded-full w-9 h-9 border border-white/30">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}>
                <SolarTermSidebar onClose={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto pb-nav">
          {children}
          <SiteFooter />
        </main>
      </div>

      {/* ── 底部导航栏 ── */}
      <BottomNav />
    </div>
  );
}
