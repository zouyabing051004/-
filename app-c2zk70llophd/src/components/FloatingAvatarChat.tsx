import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, X, Send, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { detectMediaIntent, streamCultureChat } from "@/services/cultureAgent";
import {
  type AgentMemory,
  EMPTY_MEMORY,
  absorbMessage,
  loadMemory,
  memoryForPrompt,
  saveMemory,
} from "@/services/userMemory";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentSolarTerm } from "@/data/solarTerms";
import { toast } from "sonner";

// 悬浮四四与「AI伙伴」页（四四的家）之间的接力：带着未完成的请求跳转
export const PENDING_MESSAGE_KEY = "sisi-pending-message";

gsap.registerPlugin(useGSAP);

/* ── 四季配置（文档3.2 四季专属性格矩阵）── */
const SEASON_CONFIG = {
  春: {
    glow: "#FF8C69",
    glowRgb: "255,140,105",
    headerBg: "linear-gradient(135deg,#FF8C69,#FFB08C)",
    emoji: "🌸",
    mood: "好奇活泼",
    greetings: [
      "嗨！我是四四，让我看看鹿角今天收到了什么信号～",
      "春天来啦，万物都睡醒咯！今天想探索哪个节气呀？",
      "你知道吗？春季有6个节气，每个都藏着小秘密哦！",
    ],
    quickBg: "bg-[#FFF0E8]",
    quickBorder: "border-[#FF8C69]/40",
    quickHover: "hover:bg-[#FFE4D4] hover:border-[#FF8C69]/70",
    sleepy: false,
  },
  夏: {
    glow: "#4ECDC4",
    glowRgb: "78,205,196",
    headerBg: "linear-gradient(135deg,#4ECDC4,#7EDDD8)",
    emoji: "🌿",
    mood: "热情开朗",
    greetings: [
      "今天好热呀～我们一起学节气知识解暑吧！",
      "嗨！夏天的节气超级有趣，快来一起探索～",
      "我的鹿角感应到夏天的信号啦！有什么想问的吗？",
    ],
    quickBg: "bg-[#E8FAFA]",
    quickBorder: "border-[#4ECDC4]/40",
    quickHover: "hover:bg-[#D4F5F2] hover:border-[#4ECDC4]/70",
    sleepy: false,
  },
  秋: {
    glow: "#E8A87C",
    glowRgb: "232,168,124",
    headerBg: "linear-gradient(135deg,#E8A87C,#F0C49A)",
    emoji: "🍂",
    mood: "温柔静谧",
    greetings: [
      "秋天的节气好美哦，每片落叶都有故事～",
      "嗨小朋友，今天想了解哪个秋天的节气呀？",
      "让我闻闻…鹿角感应到麦穗香气啦！来问我吧～",
    ],
    quickBg: "bg-[#FFF5E8]",
    quickBorder: "border-[#E8A87C]/40",
    quickHover: "hover:bg-[#FFECD4] hover:border-[#E8A87C]/70",
    sleepy: false,
  },
  冬: {
    glow: "#87CEEB",
    glowRgb: "135,206,235",
    headerBg: "linear-gradient(135deg,#87CEEB,#AADDEE)",
    emoji: "❄️",
    mood: "慵懒迷糊",
    greetings: [
      "呼～～冬天好冷，四四差点睡着了呢！（点我叫醒我哦）",
      "阿嚏～！谢谢你叫醒我！冬天的节气让我讲给你听吧～",
      "哈欠…冬天好困哦，但为了你，四四打起精神啦！",
    ],
    quickBg: "bg-[#E8F4FF]",
    quickBorder: "border-[#87CEEB]/40",
    quickHover: "hover:bg-[#D4ECFF] hover:border-[#87CEEB]/70",
    sleepy: true,
  },
} as const;

/* ── 九宫格情绪（文档4.4）── */
const EMOTIONS = {
  happy:    { face: "😄", label: "开心" },
  curious:  { face: "🤔", label: "好奇" },
  surprised:{ face: "😮", label: "惊讶" },
  gentle:   { face: "🥰", label: "温柔" },
  confused: { face: "😵", label: "困惑" },
  proud:    { face: "😎", label: "得意" },
  sleepy:   { face: "😴", label: "困倦" },
  sad:      { face: "🥺", label: "难过" },
  default:  { face: "😊", label: "默认" },
} as const;
type EmotionKey = keyof typeof EMOTIONS;

/* ── 快捷问题（跟随四季文案）── */
const QUICK_QUESTIONS_BY_SEASON: Record<string, Array<{ label: string; q: string }>> = {
  春: [
    { label: "🌸 立春是什么意思？", q: "用儿童能理解的方式介绍立春节气" },
    { label: "🌱 春天有哪些节气？", q: "春季的六个节气分别是什么？有什么特点？" },
    { label: "🍃 春天吃什么好？", q: "春季节气饮食有哪些讲究，适合小朋友吃什么？" },
    { label: "🦋 春天有什么习俗？", q: "介绍几个有趣的春季节气传统习俗" },
  ],
  夏: [
    { label: "☀️ 夏至是什么意思？", q: "用儿童能理解的方式介绍夏至节气" },
    { label: "🌊 夏天怎么过节气？", q: "夏季节气有哪些有趣的习俗和活动？" },
    { label: "🍉 夏天吃什么解暑？", q: "夏季节气推荐吃哪些食物，适合小朋友的？" },
    { label: "🌺 夏天植物有什么变化？", q: "夏季节气时大自然的植物有哪些变化？" },
  ],
  秋: [
    { label: "🍂 秋分是什么意思？", q: "用儿童能理解的方式介绍秋分节气" },
    { label: "🌾 秋天为什么要丰收？", q: "秋季节气为什么是丰收的季节？" },
    { label: "🥮 秋天吃什么好？", q: "秋季节气推荐的食物有哪些？适合小朋友的？" },
    { label: "🦅 秋天的动物去哪了？", q: "秋季节气时动物们都在做什么？" },
  ],
  冬: [
    { label: "❄️ 冬至是什么意思？", q: "用儿童能理解的方式介绍冬至节气" },
    { label: "🥟 冬天为什么吃饺子？", q: "冬至为什么要吃饺子？有什么传说故事？" },
    { label: "☃️ 冬天动物在干什么？", q: "冬季节气时动物们都去哪里了？" },
    { label: "🔥 冬天怎么保暖？", q: "冬季节气有哪些御寒保暖的传统习俗？" },
  ],
};

const QUICK_QUESTIONS_EN: Record<string, Array<{ label: string; q: string }>> = {
  春: [
    { label: "🌸 What is Start of Spring?", q: "Explain the solar term Start of Spring for kids" },
    { label: "🌱 Spring solar terms?", q: "What are the six spring solar terms?" },
    { label: "🍃 What to eat in spring?", q: "What do people eat during spring solar terms?" },
    { label: "🦋 Spring traditions?", q: "Tell me fun spring solar term traditions" },
  ],
  夏: [
    { label: "☀️ What is Summer Solstice?", q: "Explain the Summer Solstice for kids" },
    { label: "🌊 Summer traditions?", q: "What fun traditions happen in summer solar terms?" },
    { label: "🍉 Cool summer foods?", q: "What do people eat to stay cool in summer solar terms?" },
    { label: "🌺 Nature in summer?", q: "How do plants change during summer solar terms?" },
  ],
  秋: [
    { label: "🍂 What is Autumn Equinox?", q: "Explain the Autumn Equinox for kids" },
    { label: "🌾 Why harvest in autumn?", q: "Why is autumn the harvest season?" },
    { label: "🥮 Autumn foods?", q: "What do people eat during autumn solar terms?" },
    { label: "🦅 Where do animals go?", q: "What do animals do during autumn solar terms?" },
  ],
  冬: [
    { label: "❄️ What is Winter Solstice?", q: "Explain the Winter Solstice for kids" },
    { label: "🥟 Why dumplings on Dongzhi?", q: "Why do people eat dumplings on the Winter Solstice?" },
    { label: "☃️ Animals in winter?", q: "What do animals do during winter solar terms?" },
    { label: "🔥 Keeping warm?", q: "What are traditional ways to keep warm in winter solar terms?" },
  ],
};

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const MASCOT_IMG = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

/* ── 粒子爆炸（点击反馈）── */
function spawnParticles(x: number, y: number, color: string) {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const symbols = ["✦", "✧", "⭐", "🌟", "✨", "💫", "⚡"];
    el.textContent = symbols[i % symbols.length];
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      font-size:${12 + Math.random() * 10}px;
      pointer-events:none;z-index:9999;
      color:${color};user-select:none;
    `;
    document.body.appendChild(el);
    const angle  = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.8;
    const dist   = 40 + Math.random() * 50;
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 20,
      autoAlpha: 0,
      scale: 0.3,
      duration: 0.7 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }
}

/* ── 待机台词（随机弹出）── */
const IDLE_PHRASES: Record<string, string[]> = {
  春: ["嗨嗨嗨！👋", "今天学节气了吗？", "鹿角开花啦🌸"],
  夏: ["好热呀☀️！", "问我夏天的秘密吧！", "萤火虫出来啦🌿"],
  秋: ["落叶好美哦🍂", "今天想探索哪个节气？", "我闻到麦穗香～"],
  冬: ["Zzz...💤", "轻轻叫醒我～", "冬眠中，点我！❄️"],
};

/* ══════════════════════════════════════════
   浮动按钮组件 v2 — 全身大展示 + 精细动效
══════════════════════════════════════════ */
function FloatingBtn({ season, onClick, lang }: { season: keyof typeof SEASON_CONFIG; onClick: () => void; lang: "zh" | "en" }) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLButtonElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);       // 主体图片容器（做身体运动）
  const imgRef     = useRef<HTMLImageElement>(null);     // 图片本身（做呼吸缩放）
  const glowRef    = useRef<HTMLDivElement>(null);       // 底部光晕
  const bubbleRef  = useRef<HTMLDivElement>(null);       // 随机台词气泡
  const shadowRef  = useRef<HTMLDivElement>(null);       // 地面投影
  const cfg        = SEASON_CONFIG[season];
  const isSleepy   = cfg.sleepy;
  const [phrase, setPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);

  /* 随机台词气泡 */
  useEffect(() => {
    const phrases = IDLE_PHRASES[season] ?? IDLE_PHRASES["春"];
    const schedule = () => {
      const delay = isSleepy ? 5000 : 8000 + Math.random() * 7000;
      const timer = setTimeout(() => {
        setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setShowPhrase(true);
        setTimeout(() => setShowPhrase(false), 2800);
        schedule();
      }, delay);
      return timer;
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, [season, isSleepy]);

  /* GSAP 待机动效（四季专属身体语言）*/
  useGSAP(() => {
    const body  = bodyRef.current;
    const img   = imgRef.current;
    const glow  = glowRef.current;
    const shad  = shadowRef.current;
    if (!body || !img || !glow) return;

    gsap.killTweensOf([body, img, glow, shad]);

    if (isSleepy) {
      /* 冬：慵懒倾斜 + 缓慢呼吸，地面影随之 */
      gsap.to(body, { rotation: 8, y: 6, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,  { scale: 1.03, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(glow, { opacity: 0.25, scale: 1.08, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      if (shad) gsap.to(shad, { scaleX: 0.85, opacity: 0.2, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (season === "春") {
      /* 春：轻盈蹦跳 */
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(body, { y: -14, rotation: -3, duration: 0.42, ease: "power2.out" })
        .to(body, { y: 0,   rotation:  0, duration: 0.32, ease: "bounce.out" })
        .to(body, { y: -6,  rotation:  2, duration: 0.28, ease: "power2.out" })
        .to(body, { y: 0,   rotation:  0, duration: 0.22, ease: "bounce.out" })
        .to(body, {}, "+=1.2");
      if (shad) {
        gsap.to(shad, { scaleX: 0.6, opacity: 0.15, duration: 0.42, repeat: -1, yoyo: true, ease: "power2.out", repeatDelay: 1.4 });
      }
      gsap.to(glow, { opacity: 0.8, scale: 1.25, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (season === "夏") {
      /* 夏：左右扇风 */
      gsap.to(body, { rotation: 5, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,  { scale: 1.05, duration: 1.0, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(glow, { opacity: 0.9, scale: 1.3, duration: 1.0, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (season === "秋") {
      /* 秋：轻柔摇摆 + 缓慢浮动 */
      gsap.to(body, { y: -8, rotation: -2, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,  { scale: 1.04, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(glow, { opacity: 0.6, scale: 1.18, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    /* 随机眨眼（非冬季）*/
    if (!isSleepy) {
      const scheduleWink = () => {
        gsap.delayedCall(6 + Math.random() * 5, () => {
          if (!img) return;
          gsap.timeline()
            .to(img, { scaleY: 0.12, scaleX: 1.08, duration: 0.07, ease: "power2.in" })
            .to(img, { scaleY: 1,    scaleX: 1,    duration: 0.12, ease: "back.out(2)" })
            .call(scheduleWink);
        });
      };
      scheduleWink();

      /* 随机耳抖（非冬）*/
      const scheduleEar = () => {
        gsap.delayedCall(10 + Math.random() * 8, () => {
          if (!body) return;
          gsap.timeline()
            .to(body, { skewX: 5, duration: 0.1 })
            .to(body, { skewX: -4, duration: 0.1 })
            .to(body, { skewX: 3, duration: 0.08 })
            .to(body, { skewX: 0, duration: 0.12, ease: "elastic.out(1,0.5)" })
            .call(scheduleEar);
        });
      };
      scheduleEar();
    }
  }, { scope: wrapRef, dependencies: [season] });

  /* 点击：弹跳 + 粒子爆炸 */
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    spawnParticles(cx, cy, cfg.glow);
    if (!cardRef.current) return;
    gsap.timeline()
      .to(cardRef.current, { scale: 0.85, rotation: -4, duration: 0.1, ease: "power2.in" })
      .to(cardRef.current, { scale: 1.15, rotation:  3, duration: 0.18, ease: "back.out(3)" })
      .to(cardRef.current, { scale: 1,    rotation:  0, duration: 0.15, ease: "elastic.out(1,0.5)" })
      .then(() => onClick());
  }, [onClick, cfg.glow]);

  return (
    <div
      ref={wrapRef}
      className="fixed z-40"
      style={{ bottom: "calc(88px + env(safe-area-inset-bottom,0px) + 12px)", right: 14 }}
    >
      {/* 台词气泡 */}
      <div
        className={cn(
          "absolute bottom-full right-0 mb-2 transition-all duration-300 pointer-events-none",
          showPhrase ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        <div
          className="text-white text-xs font-bold px-3 py-2 rounded-2xl rounded-br-sm whitespace-nowrap shadow-lg max-w-[140px] text-center"
          style={{ background: cfg.glow }}
        >
          {phrase}
          <div className="absolute top-full right-3 w-0 h-0 border-x-4 border-x-transparent border-t-4"
            style={{ borderTopColor: cfg.glow }} />
        </div>
      </div>

      {/* 主卡片按钮（全身展示，矩形圆角）*/}
      <button
        ref={cardRef}
        onClick={handleClick}
        aria-label={lang === "en" ? "Open Sisi" : "打开四四小助手"}
        className="group relative flex flex-col items-center"
        style={{ width: 80 }}
      >
        {/* 季节光晕背景 */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, rgba(${cfg.glowRgb},0.55) 0%, rgba(${cfg.glowRgb},0.12) 60%, transparent 80%)`,
            filter: "blur(6px)",
            transform: "scale(1.2)",
          }}
        />
        {/* 脉冲外圈 */}
        <span
          className="absolute inset-0 rounded-3xl animate-ping"
          style={{ background: `rgba(${cfg.glowRgb},0.2)`, animationDuration: "2s" }}
        />

        {/* 主体图片（全身大展示）*/}
        <div
          ref={bodyRef}
          className="relative z-10"
          style={{ width: 80, height: 100, transformOrigin: "bottom center" }}
        >
          <img
            ref={imgRef}
            src={MASCOT_IMG}
            alt="四四"
            className="w-full h-full rounded-3xl"
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              /* mix-blend-mode: multiply 让白色背景融入，模拟扣图效果 */
              mixBlendMode: "multiply",
              filter: isSleepy
                ? "brightness(0.88) saturate(0.7)"
                : "brightness(1.05) saturate(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
              background: "transparent",
            }}
          />
          {/* 冬季冰晶覆盖 */}
          {isSleepy && (
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(135,206,235,0.15) 0%, rgba(135,206,235,0.35) 100%)" }} />
          )}
          {/* Zzz 冬季标记 */}
          {isSleepy && (
            <span className="absolute top-1 right-1 text-base animate-bounce select-none z-20">💤</span>
          )}
          {/* 季节粒子浮动（春/夏/秋）*/}
          {!isSleepy && (
            <span
              className="absolute -top-2 -right-2 text-xl select-none z-20 animate-bounce"
              style={{ animationDuration: "1.8s" }}
            >
              {cfg.emoji}
            </span>
          )}
        </div>

        {/* 地面投影椭圆 */}
        <div
          ref={shadowRef}
          className="relative z-10 mt-1 rounded-full"
          style={{
            width: 54, height: 8,
            background: `radial-gradient(ellipse, rgba(${cfg.glowRgb},0.4) 0%, transparent 70%)`,
          }}
        />

        {/* 名称标签 */}
        <div
          className="relative z-10 mt-1 px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap shadow"
          style={{ background: cfg.glow, fontSize: 11 }}
        >
          {lang === "en" ? "Sisi" : "四四"} {cfg.emoji}
        </div>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   聊天面板 v2 — 大尺寸头像 + 精细动效
══════════════════════════════════════════ */
function ChatPanel({
  isOpen, onClose, season, messages, isStreaming,
  onSend, input, setInput, scrollRef, onGoHome, lang,
}: {
  isOpen: boolean; onClose: () => void;
  season: keyof typeof SEASON_CONFIG;
  messages: Message[]; isStreaming: boolean;
  onSend: (text: string) => void;
  input: string; setInput: (v: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onGoHome: () => void;
  lang: "zh" | "en";
}) {
  const panelRef     = useRef<HTMLDivElement>(null);
  const mascotRef    = useRef<HTMLDivElement>(null);  // 面板大吉祥物
  const mascotImgRef = useRef<HTMLImageElement>(null);
  const emotionRef   = useRef<HTMLDivElement>(null);
  const cfg          = SEASON_CONFIG[season];
  const quickQ       = lang === "en"
    ? (QUICK_QUESTIONS_EN[season] ?? QUICK_QUESTIONS_EN["春"])
    : (QUICK_QUESTIONS_BY_SEASON[season] ?? QUICK_QUESTIONS_BY_SEASON["春"]);
  const lastMsgRef   = useRef<string>("");

  /* 情绪状态 */
  const [emotion, setEmotion] = useState<EmotionKey>("gentle");
  useEffect(() => {
    if (!isOpen) return;
    if (cfg.sleepy) { setEmotion("sleepy"); return; }
    if (isStreaming) { setEmotion("curious"); return; }
    const last = messages[messages.length - 1];
    if (!last) return;
    if (last.role === "assistant" && last.content !== lastMsgRef.current) {
      lastMsgRef.current = last.content;
      const opts: EmotionKey[] = ["happy", "gentle", "proud", "surprised"];
      setEmotion(opts[Math.floor(Math.random() * opts.length)]);
    }
  }, [isStreaming, messages, isOpen, cfg.sleepy]);

  /* 面板滑入/滑出 */
  useGSAP(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (isOpen) {
      gsap.fromTo(panel,
        { x: "100%", autoAlpha: 0 },
        { x: "0%",   autoAlpha: 1, duration: 0.44, ease: "power3.out" }
      );
    } else {
      gsap.to(panel, { x: "100%", autoAlpha: 0, duration: 0.28, ease: "power2.in" });
    }
  }, { scope: panelRef, dependencies: [isOpen] });

  /* 面板大吉祥物待机动效 */
  useGSAP(() => {
    const mascot = mascotRef.current;
    const img    = mascotImgRef.current;
    if (!mascot || !img || !isOpen) return;

    if (cfg.sleepy) {
      gsap.to(mascot, { rotation: 10, y: 4, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,    { scale: 1.04, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (season === "春") {
      gsap.to(mascot, { y: -6, duration: 0.8, repeat: -1, yoyo: true, ease: "power2.inOut" });
      gsap.to(img,    { scale: 1.06, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else if (season === "夏") {
      gsap.to(mascot, { rotation: 4, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,    { scale: 1.05, duration: 1.0, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else {
      gsap.to(mascot, { y: -4, duration: 2.0, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(img,    { scale: 1.04, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, { scope: mascotRef, dependencies: [isOpen, season] });

  /* 情绪气泡弹入 */
  useGSAP(() => {
    const el = emotionRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { scale: 0.3, autoAlpha: 0 },
      { scale: 1,   autoAlpha: 1, duration: 0.35, ease: "back.out(2.5)" }
    );
  }, { scope: emotionRef, dependencies: [emotion] });

  /* 新消息气泡入场 */
  const msgListRef   = useRef<HTMLDivElement>(null);
  const prevCount    = useRef(0);
  useEffect(() => {
    const list = msgListRef.current;
    if (!list) return;
    const items = list.querySelectorAll(".msg-bubble");
    const newCount = items.length - prevCount.current;
    if (newCount > 0) {
      const newItems = Array.from(items).slice(-newCount);
      gsap.fromTo(newItems,
        { y: 20, autoAlpha: 0, scale: 0.92 },
        { y: 0,  autoAlpha: 1, scale: 1,    stagger: 0.07, duration: 0.32, ease: "back.out(1.6)" }
      );
    }
    prevCount.current = items.length;
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, scrollRef]);

  if (!isOpen && !panelRef.current) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col bg-[#FFFDF5] shadow-2xl"
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      {/* ── 面板头部：大尺寸吉祥物展示区 ── */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ background: cfg.headerBg, minHeight: 130 }}
      >
        {/* 装饰波浪底部 */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          viewBox="0 0 400 28" preserveAspectRatio="none"
          style={{ height: 28 }}
        >
          <path d="M0,14 C100,28 300,0 400,14 L400,28 L0,28 Z" fill="hsl(var(--background))" />
        </svg>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-end gap-4 px-5 pt-4 pb-6">
          {/* 大吉祥物（全身展示）*/}
          <div
            ref={mascotRef}
            className="relative shrink-0"
            style={{ width: 88, height: 108, transformOrigin: "bottom center" }}
          >
            <img
              ref={mascotImgRef}
              src={MASCOT_IMG}
              alt="四四"
              className="w-full h-full rounded-3xl"
              style={{
                objectFit: "cover",
                objectPosition: "top center",
                mixBlendMode: "multiply",
                filter: cfg.sleepy
                  ? "brightness(0.85) saturate(0.7)"
                  : "brightness(1.06) saturate(1.12) drop-shadow(0 6px 12px rgba(0,0,0,0.18))",
              }}
            />
            {/* 冬季冰晶 */}
            {cfg.sleepy && (
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "linear-gradient(180deg,rgba(135,206,235,0.2) 0%,rgba(135,206,235,0.45) 100%)" }} />
            )}
            {/* 情绪气泡（漂浮在吉祥物头顶）*/}
            <div
              ref={emotionRef}
              className="absolute -top-4 -right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg shadow-md"
              style={{ border: `2px solid ${cfg.glow}` }}
            >
              {EMOTIONS[emotion].face}
            </div>
          </div>

          {/* 文字区 */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-white text-lg font-serif leading-none">{lang === "en" ? "Sisi the Deer" : "小鹿·廿四"}</span>
              <span className="text-white/75 text-xs">{lang === "en" ? "Sisi" : "四四"}</span>
            </div>
            <p className="text-white/80 text-sm font-medium">{cfg.mood} · 节气小精灵</p>
            <div
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.22)" }}
            >
              <Sparkles className="w-3 h-3" />
              {EMOTIONS[emotion].label}中 {cfg.emoji}
            </div>
          </div>
        </div>
      </div>

      {/* 开场台词条 */}
      {messages.length <= 1 && (
        <div
          className="px-4 py-2.5 shrink-0 text-sm font-medium"
          style={{
            background: `rgba(${cfg.glowRgb},0.1)`,
            color: cfg.glow,
            borderBottom: `1px solid rgba(${cfg.glowRgb},0.18)`,
          }}
        >
          {cfg.greetings[0]}
        </div>
      )}

      {/* 快捷问题 */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-border shrink-0 bg-background/50">
          <p className="text-xs text-muted-foreground mb-2 font-semibold tracking-wide">{lang === "en" ? "💡 Ask me:" : "💡 快来问我："}</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQ.map(({ label, q }) => (
              <button
                key={q}
                onClick={() => onSend(q)}
                className={cn(
                  "text-left text-xs px-3 py-2.5 border rounded-2xl transition-all duration-200",
                  "leading-snug font-medium active:scale-95",
                  cfg.quickBg, cfg.quickBorder, cfg.quickHover
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <ScrollArea className="flex-1">
        <div ref={msgListRef} className="px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn("msg-bubble flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {/* 头像：助手用全身小图 */}
              <div className={cn(
                "shrink-0 shadow-sm",
                msg.role === "assistant"
                  ? "w-10 h-12 rounded-2xl overflow-hidden border border-border/60"
                  : "w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-base mt-1"
              )}>
                {msg.role === "assistant"
                  ? <img src={MASCOT_IMG} alt="四四" className="w-full h-full object-cover object-top"
                      style={{ mixBlendMode: "multiply" }} />
                  : "😊"
                }
              </div>
              {/* 气泡 */}
              <div
                className={cn(
                  "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "assistant"
                    ? "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
                    : "text-white rounded-tr-sm"
                )}
                style={msg.role === "user" ? { background: cfg.glow } : {}}
              >
                {msg.content}
                {msg.role === "assistant" && isStreaming && msg === messages[messages.length - 1] && (
                  <span className="inline-block w-1 h-3.5 ml-0.5 animate-pulse rounded"
                    style={{ background: cfg.glow }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 输入区 */}
      <div className="px-4 py-3 border-t border-border shrink-0 bg-background/80">
        {/* 去四四的家：画画/做视频/收藏诗词的完整乐园 */}
        <button
          type="button"
          onClick={onGoHome}
          className="w-full mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-2xl border transition-all active:scale-95"
          style={{ color: cfg.glow, borderColor: `rgba(${cfg.glowRgb},0.4)`, background: `rgba(${cfg.glowRgb},0.08)` }}
        >
          <Home className="w-3.5 h-3.5" />
          {lang === "en" ? "Sisi's Home 🎨 Paint · Videos · My Poems" : "去四四的家 🎨 画画 · 做视频 · 我的诗集"}
        </button>
        <form
          onSubmit={e => { e.preventDefault(); onSend(input); }}
          className="flex gap-2 items-center"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={lang === "en" ? "Ask me about solar terms & poems…" : cfg.sleepy ? "叫醒四四，问我节气知识…" : "问我节气知识…"}
            disabled={isStreaming}
            className="flex-1 rounded-2xl text-sm border-border/60 focus:border-primary bg-card"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 disabled:opacity-50 transition-all active:scale-90"
            style={{ background: cfg.glow }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-2">
          {lang === "en" ? `${cfg.emoji} Sisi the solar-term sprite, exploring with you` : `${cfg.emoji} 四四·${cfg.mood} — 节气小精灵陪你探索`}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   主导出组件
══════════════════════════════════════════ */
export default function FloatingAvatarChat() {
  const [isOpen, setIsOpen]       = useState(false);
  const [input, setInput]         = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef  = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { lang }  = useLanguage();

  /* 长期记忆：与「AI伙伴」页共用同一份（登录=云端，游客=本地） */
  const memoryRef = useRef<AgentMemory>(EMPTY_MEMORY);
  useEffect(() => {
    loadMemory(user?.id ?? null).then((m) => {
      memoryRef.current = m;
    });
  }, [user?.id]);

  /* 当前季节 */
  const currentTerm = getCurrentSolarTerm();
  const season = (currentTerm.season in SEASON_CONFIG
    ? currentTerm.season : "春") as keyof typeof SEASON_CONFIG;
  const cfg = SEASON_CONFIG[season];

  /* 初始欢迎消息（随季节变化）*/
  const [messages, setMessages] = useState<Message[]>(() => [{
    role: "assistant",
    id: "welcome",
    content: `你好呀小朋友！${cfg.emoji}\n\n${cfg.greetings[Math.floor(Math.random() * cfg.greetings.length)]}\n\n节气、古诗、传统节日都可以问我；想画画或做小视频，就到"四四的家"来～`,
  }]);

  /* 全站语言切换时，重置欢迎语 */
  useEffect(() => {
    setMessages(prev => prev.length === 1 && prev[0].id === "welcome"
      ? [{
          role: "assistant",
          id: "welcome",
          content: lang === "en"
            ? `Hi little friend! ${cfg.emoji}\n\nI'm Sisi the deer! Ask me anything about the 24 solar terms, poems and festivals. Want a painting or a little video? Come to Sisi's Home!`
            : `你好呀小朋友！${cfg.emoji}\n\n${cfg.greetings[0]}\n\n节气、古诗、传统节日都可以问我；想画画或做小视频，就到"四四的家"来～`,
        }]
      : prev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* 去四四的家（AI伙伴页），可携带未完成的请求 */
  const goHome = useCallback((pendingText?: string) => {
    if (pendingText) {
      try { sessionStorage.setItem(PENDING_MESSAGE_KEY, pendingText); } catch { /* ignore */ }
    }
    setIsOpen(false);
    navigate("/culture");
  }, [navigate]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    /* 画画/视频请求 → 带着请求去四四的家（那里有画板和放映厅） */
    if (detectMediaIntent(text)) {
      setMessages(prev => [...prev,
        { role: "user", content: text, id: Date.now().toString() },
        { role: "assistant", content: lang === "en"
          ? "I need my big easel at home for that! 🎨 Taking you there now~"
          : "画画要用我家里的大画板哦！🎨 这就带你去，马上开始画～", id: (Date.now() + 1).toString() },
      ]);
      setInput("");
      setTimeout(() => goHome(text), 900);
      return;
    }

    const userMsg: Message     = { role: "user",      content: text, id: Date.now().toString() };
    const assistantMsg: Message = { role: "assistant", content: "",   id: (Date.now() + 1).toString() };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    /* 沉淀长期记忆（与AI伙伴页同一份） */
    const nextMemory = absorbMessage(memoryRef.current, text);
    memoryRef.current = nextMemory;
    void saveMemory(user?.id ?? null, nextMemory);

    const history = messages
      .filter(m => m.content && m.id !== "welcome")
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      await streamCultureChat(
        text,
        history,
        lang,
        memoryForPrompt(nextMemory),
        (chunk) => setMessages(prev => prev.map(m =>
          m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m
        )),
        () => setIsStreaming(false),
        () => { toast.error("AI回复出错，请重试"); setIsStreaming(false); },
        controller.signal
      );
    } catch {
      toast.error("AI回复出错，请重试");
      setIsStreaming(false);
    }
  }

  /* 关闭面板时取消流式请求 */
  const handleClose = () => {
    abortRef.current?.abort();
    setIsOpen(false);
  };

  /* 在四四的家（AI伙伴页）不重复出现，避免一屏两个四四 */
  if (location.pathname.startsWith("/culture")) return null;

  return (
    <>
      <FloatingBtn season={season} onClick={() => setIsOpen(true)} lang={lang} />
      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        season={season}
        messages={messages}
        isStreaming={isStreaming}
        onSend={sendMessage}
        input={input}
        setInput={setInput}
        scrollRef={scrollRef}
        onGoHome={() => goHome()}
        lang={lang}
      />
      {/* 面板背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={handleClose}
        />
      )}
    </>
  );
}
