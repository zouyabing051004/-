import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAchievement, type Badge } from "@/contexts/AchievementContext";

gsap.registerPlugin(useGSAP);

const MASCOT_IMG = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

/* ── confetti 彩纸粒子 ── */
const CONFETTI_COLORS = ["#FF8C69", "#4ECDC4", "#E8A87C", "#87CEEB", "#FFD700", "#FF69B4", "#98FB98", "#DDA0DD"];

function spawnConfetti(container: HTMLElement, count = 36) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const isCircle = Math.random() > 0.5;
    el.style.cssText = `
      position:absolute;
      width:${6 + Math.random() * 8}px;
      height:${isCircle ? (6 + Math.random() * 8) + "px" : (4 + Math.random() * 6) + "px"};
      background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      border-radius:${isCircle ? "50%" : "2px"};
      left:${20 + Math.random() * 60}%;
      top:-10px;
      pointer-events:none;
      z-index:1;
    `;
    container.appendChild(el);
    gsap.to(el, {
      y: 340 + Math.random() * 200,
      x: (Math.random() - 0.5) * 120,
      rotation: 360 * (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
      autoAlpha: 0,
      duration: 1.2 + Math.random() * 1.0,
      delay: Math.random() * 0.6,
      ease: "power1.in",
      onComplete: () => el.remove(),
    });
  }
}

/* ── 星光爆炸 ── */
const STAR_SYMBOLS = ["✦", "✧", "★", "✨", "⭐"];
function spawnStars(container: HTMLElement, cx: number, cy: number) {
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("span");
    el.textContent = STAR_SYMBOLS[i % STAR_SYMBOLS.length];
    const angle = (Math.PI * 2 / 12) * i;
    const dist  = 50 + Math.random() * 40;
    el.style.cssText = `
      position:absolute;font-size:${14 + Math.random() * 10}px;
      left:${cx}px;top:${cy}px;
      transform:translate(-50%,-50%);
      pointer-events:none;z-index:10;
    `;
    container.appendChild(el);
    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      autoAlpha: 0,
      scale: 0.2,
      duration: 0.9 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }
}

/* ══════════════════════════════════════════
   徽章卡片展示
══════════════════════════════════════════ */
function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{ filter: `drop-shadow(0 0 16px ${badge.glowColor}88)` }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-2xl"
        style={{ background: `radial-gradient(circle at 35% 35%, white, ${badge.glowColor}55)` }}
      >
        {badge.emoji}
      </div>
      <p className="text-xl font-bold text-white mt-1 font-serif text-balance text-center"
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
        {badge.name}
      </p>
      <p className="text-sm text-white/85 text-center max-w-[200px] text-pretty">
        {badge.desc}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   主覆盖层组件
══════════════════════════════════════════ */
export default function CelebrationOverlay() {
  const { celebration, dismissCelebration } = useAchievement();
  const overlayRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const mascotRef   = useRef<HTMLDivElement>(null);
  const confRef     = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const overlay = overlayRef.current;
    if (!overlay) { dismissCelebration(); return; }
    gsap.to(overlay, {
      autoAlpha: 0, scale: 1.04, duration: 0.28, ease: "power2.in",
      onComplete: dismissCelebration,
    });
  }, [dismissCelebration]);

  useGSAP(() => {
    if (!celebration) return;
    const overlay  = overlayRef.current;
    const card     = cardRef.current;
    const textEl   = textRef.current;
    const mascot   = mascotRef.current;
    const confetti = confRef.current;
    if (!overlay || !card || !textEl || !mascot) return;

    // 播种 confetti
    if (confetti) spawnConfetti(confetti, 40);

    const badge = celebration.badge;
    // 星光从徽章中心爆出
    const rect = card.getBoundingClientRect();
    if (confetti) spawnStars(confetti, rect.left + rect.width / 2, rect.top + rect.height / 2);

    const tl = gsap.timeline();
    // 1. 背景淡入
    tl.fromTo(overlay,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: "power2.out" }
    )
    // 2. 吉祥物从下弹入
    .fromTo(mascot,
      { y: 60, autoAlpha: 0, scale: 0.6 },
      { y: 0,  autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" },
      "-=0.1"
    )
    // 3. 徽章卡放大弹入
    .fromTo(card,
      { scale: 0.2, autoAlpha: 0, rotation: -15 },
      { scale: 1,   autoAlpha: 1, rotation: 0,  duration: 0.55, ease: "back.out(2.8)" },
      "-=0.25"
    )
    // 4. 徽章持续发光脉冲
    .to(card, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" })
    // 5. 文字滑入
    .fromTo(textEl,
      { y: 20, autoAlpha: 0 },
      { y: 0,  autoAlpha: 1, duration: 0.35, ease: "power3.out" },
      "-=0.5"
    )
    // 6. 吉祥物庆祝跳跃
    .to(mascot, { y: -12, duration: 0.3, yoyo: true, repeat: 3, ease: "power2.inOut" }, "-=0.6");

    // 4秒后自动关闭
    timerRef.current = setTimeout(dismiss, 4200);

    // 设置彩带颜色到背景
    gsap.to(overlay, {
      "--glow-color": badge.glowColor,
      duration: 0,
    });
  }, { scope: overlayRef, dependencies: [celebration] });

  if (!celebration) return null;

  const badge = celebration.badge;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${badge.glowColor}CC 0%, ${badge.glowColor}88 40%, rgba(0,0,0,0.82) 100%)`,
      }}
      onClick={dismiss}
    >
      {/* confetti 容器 */}
      <div ref={confRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* 吉祥物 */}
      <div ref={mascotRef} className="relative mb-2 z-10">
        <div className="w-20 h-24 rounded-3xl overflow-hidden border-3 border-white/60 shadow-2xl"
          style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.3))" }}>
          <img src={MASCOT_IMG} alt="四四" className="w-full h-full object-cover object-top"
            style={{ mixBlendMode: "multiply" }} />
        </div>
        {/* 庆祝表情 */}
        <span className="absolute -top-3 -right-3 text-2xl animate-bounce">🎉</span>
      </div>

      {/* 徽章卡片 */}
      <div ref={cardRef} className="relative z-10 mb-4">
        <BadgeCard badge={badge} />
        {/* 光圈 */}
        <div
          className="absolute inset-[-16px] rounded-full animate-ping pointer-events-none opacity-40"
          style={{ background: `radial-gradient(circle, ${badge.glowColor}80 0%, transparent 70%)` }}
        />
      </div>

      {/* 文字区 */}
      <div ref={textRef} className="z-10 text-center px-8">
        <div
          className="inline-block px-5 py-2 rounded-2xl mb-3 text-sm font-bold text-white"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
        >
          🏅 解锁新徽章！
        </div>
        <p className="text-white/75 text-sm">
          {badge.type === "streak" ? `坚持学习，四四为你骄傲！🦌` : `你已探索了节气的奥秘！继续加油～`}
        </p>
        <p className="text-white/45 text-xs mt-3">轻触任意位置继续</p>
      </div>
    </div>
  );
}
