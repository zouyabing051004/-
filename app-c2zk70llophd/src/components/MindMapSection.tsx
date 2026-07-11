import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SolarTerm } from "@/data/solarTerms";

interface MindMapSectionProps {
  term: SolarTerm;
  ageMode: "young";
}

interface BranchNode {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  content: React.ReactNode;
}

export default function MindMapSection({ term, ageMode }: MindMapSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const branches: BranchNode[] = [
    {
      id: "food",
      label: "民俗饮食",
      emoji: "🍜",
      color: "text-amber-700 dark:text-amber-300",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-300 dark:border-amber-700",
      content: <FoodContent term={term} ageMode={ageMode} />,
    },
    {
      id: "wear",
      label: "节气穿什么",
      emoji: "👕",
      color: "text-purple-700 dark:text-purple-300",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-300 dark:border-purple-700",
      content: <WearContent term={term} />,
    },
    {
      id: "story",
      label: "节气由来",
      emoji: "📖",
      color: "text-emerald-700 dark:text-emerald-300",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-300 dark:border-emerald-700",
      content: <StoryContent term={term} />,
    },
  ];

  const toggle = (id: string) => setActiveId(prev => prev === id ? null : id);
  const activeBranch = branches.find(b => b.id === activeId);

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className="flex items-center gap-2.5">
        <span className="text-xl">🗺️</span>
        <h2 className="font-bold text-foreground text-lg font-serif">节气探索地图</h2>
        <span className="text-sm text-muted-foreground">点击分支探索更多</span>
      </div>

      {/* 思维导图主体 */}
      <div className="relative">
        {/* 桌面版：横向辐射布局 */}
        <div className="hidden md:block">
          <DesktopMindMap term={term} branches={branches} activeId={activeId} onToggle={toggle} />
        </div>
        {/* 移动版：纵向列表布局 */}
        <div className="md:hidden">
          <MobileMindMap term={term} branches={branches} activeId={activeId} onToggle={toggle} />
        </div>
      </div>

      {/* 展开内容面板 */}
      {activeBranch && (
        <div
          key={activeId}
          className={cn(
            "rounded-3xl border-2 p-5 animate-in fade-in slide-in-from-top-2 duration-200",
            activeBranch.bgColor,
            activeBranch.borderColor
          )}
        >
          <div className={cn("flex items-center gap-2 mb-4 font-bold text-base", activeBranch.color)}>
            <span className="text-xl">{activeBranch.emoji}</span>
            <span>{activeBranch.label}</span>
          </div>
          {activeBranch.content}
        </div>
      )}
    </div>
  );
}

/* ── 桌面版思维导图 ── */
function DesktopMindMap({
  term,
  branches,
  activeId,
  onToggle,
}: {
  term: SolarTerm;
  branches: BranchNode[];
  activeId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="relative flex items-center" style={{ minHeight: 280 }}>
      {/* SVG 连线 */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 280"
        preserveAspectRatio="none"
      >
        {branches.map((b, i) => {
          const yPositions = [36, 140, 244];
          const cy = yPositions[i];
          const isActive = activeId === b.id;
          return (
            <path
              key={b.id}
              d={`M 148 140 Q 210 140 250 ${cy}`}
              fill="none"
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={isActive ? "3" : "2"}
              strokeDasharray={isActive ? "none" : "6 4"}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* 中心节点 */}
      <div className="relative z-10 shrink-0" style={{ marginLeft: 84 }}>
        <div className="w-32 h-32 rounded-full bg-primary flex flex-col items-center justify-center shadow-xl text-primary-foreground text-center">
          <span className="text-3xl font-bold font-serif leading-none">{term.name}</span>
          <span className="text-xs mt-1 opacity-80 font-medium">节气</span>
        </div>
      </div>

      {/* 分支节点 */}
      <div className="flex-1 min-w-0 ml-16 flex flex-col justify-between py-2" style={{ minHeight: 280 }}>
        {branches.map((b) => {
          const isActive = activeId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onToggle(b.id)}
              className={cn(
                "flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all duration-200 text-left w-full max-w-[220px]",
                "hover:scale-105 active:scale-95",
                isActive
                  ? cn(b.bgColor, b.borderColor, b.color, "shadow-lg scale-105")
                  : "bg-card border-border text-foreground hover:border-primary/40 hover:shadow-md"
              )}
            >
              <span className="text-2xl shrink-0">{b.emoji}</span>
              <div className="min-w-0">
                <p className="font-bold text-base truncate">{b.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{isActive ? "点击收起" : "点击探索"}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 移动版思维导图 ── */
function MobileMindMap({
  term,
  branches,
  activeId,
  onToggle,
}: {
  term: SolarTerm;
  branches: BranchNode[];
  activeId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* 中心节点 */}
      <div className="w-28 h-28 rounded-full bg-primary flex flex-col items-center justify-center shadow-xl text-primary-foreground text-center">
        <span className="text-2xl font-bold font-serif leading-none">{term.name}</span>
        <span className="text-xs mt-0.5 opacity-80 font-medium">节气</span>
      </div>

      {/* 竖线 */}
      <div className="w-0.5 h-5 bg-border rounded-full" />

      {/* 分支节点 */}
      <div className="flex gap-3 w-full">
        {branches.map(b => {
          const isActive = activeId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onToggle(b.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isActive
                  ? cn(b.bgColor, b.borderColor, b.color, "shadow-lg")
                  : "bg-card border-border text-foreground"
              )}
            >
              <span className="text-2xl">{b.emoji}</span>
              <p className="text-sm font-bold text-center leading-tight">{b.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── 民俗饮食内容 ── */
function FoodContent({ term, ageMode }: { term: SolarTerm; ageMode: "young" }) {
  const [tab, setTab] = useState<"north" | "south">("north");
  const fc = term.folkCustoms;

  if (!fc) {
    return (
      <div className="space-y-3">
        <div className="text-foreground leading-relaxed text-base">
          <p className="font-bold mb-1.5">🍽️ 吃什么</p>
          <p>{term.customs.eat}</p>
        </div>
        <div className="text-foreground leading-relaxed text-base">
          <p className="font-bold mb-1.5">🎋 做什么</p>
          <p>{term.customs.do}</p>
        </div>
      </div>
    );
  }

  // ageMode kept for API compatibility
  void ageMode;

  return (
    <div className="space-y-4">
      {/* 南北切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("north")}
          className={cn(
            "flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold border-2 transition-colors",
            tab === "north" ? "bg-sky-100 text-sky-700 border-sky-300" : "border-border text-muted-foreground hover:bg-accent"
          )}
        >🧊 北方</button>
        <button
          onClick={() => setTab("south")}
          className={cn(
            "flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold border-2 transition-colors",
            tab === "south" ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "border-border text-muted-foreground hover:bg-accent"
          )}
        >🌴 南方</button>
      </div>

      {/* 内容 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/60 rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-2">🍽️ 吃什么</p>
          <p className="text-base text-foreground leading-relaxed">
            {tab === "north" ? fc.north.eat : fc.south.eat}
          </p>
        </div>
        <div className="bg-background/60 rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-2">🎋 做什么</p>
          <p className="text-base text-foreground leading-relaxed">
            {tab === "north" ? fc.north.do : fc.south.do}
          </p>
        </div>
      </div>

      {/* 儿童解说 */}
      <div className="bg-amber-100/60 dark:bg-amber-900/20 rounded-2xl p-4">
        <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold mr-1">🌟 小朋友说：</span>{fc.kidsExplain}
        </p>
      </div>
    </div>
  );
}

/* ── 穿什么内容 ── */
function WearContent({ term }: { term: SolarTerm }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-200/60 dark:bg-purple-800/30 flex items-center justify-center text-2xl shrink-0">👕</div>
        <p className="text-base text-foreground leading-relaxed flex-1 min-w-0">{term.customs.wear}</p>
      </div>
    </div>
  );
}

/* ── 节气由来内容 ── */
function StoryContent({ term }: { term: SolarTerm }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📖</span>
        <p className="font-bold text-base text-foreground text-balance">{term.story.title}</p>
      </div>
      <p className="text-base text-foreground leading-relaxed">{term.story.content}</p>
      <div className="flex flex-wrap gap-2">
        {term.keywords.map(kw => (
          <span
            key={kw}
            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
