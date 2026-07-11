import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { getCurrentSolarTerm, getNextSolarTerm } from "@/data/solarTerms";
import { fetchCityWeather, getWeatherEmoji, type WeatherNow } from "@/services/weatherService";

const MASCOT_IMG = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

const seasonTheme: Record<string, {
  heroBg: string; cardBg: string; heroFg: string; heroSub: string;
  actionA: string; actionAText: string; actionB: string; actionBText: string;
  badge: string; badgeFg: string; emoji: string;
}> = {
  春: { heroBg: "#EAF7EE", cardBg: "#FEF9EC", heroFg: "#1E5C35", heroSub: "#4a8c62", actionA: "#4ECDC4", actionAText: "#fff", actionB: "#9B7FD4", actionBText: "#fff", badge: "#C8EDD6", badgeFg: "#1E5C35", emoji: "🌱" },
  夏: { heroBg: "#D8F2ED", cardBg: "#FEF9EC", heroFg: "#1A4D45", heroSub: "#2a7a70", actionA: "#4ECDC4", actionAText: "#fff", actionB: "#9B7FD4", actionBText: "#fff", badge: "#B8EDE8", badgeFg: "#1A4D45", emoji: "🌿" },
  秋: { heroBg: "#FEF3DF", cardBg: "#FFF7ED", heroFg: "#5C3A10", heroSub: "#8c6030", actionA: "#F5A623", actionAText: "#fff", actionB: "#9B7FD4", actionBText: "#fff", badge: "#F5DFB0", badgeFg: "#5C3A10", emoji: "🍂" },
  冬: { heroBg: "#E3EFF9", cardBg: "#F0F7FF", heroFg: "#1A3A5C", heroSub: "#2a5a8c", actionA: "#4ECDC4", actionAText: "#fff", actionB: "#9B7FD4", actionBText: "#fff", badge: "#C0D8F0", badgeFg: "#1A3A5C", emoji: "❄️" },
};

const mascotLines: Record<string, string[]> = {
  春: ["今天春风暖暖的，我们来听故事吧！", "万物复苏，一起学节气～", "春雨沙沙，四四等你哦！"],
  夏: ["今天芒果香香甜甜，我们来听故事吧！", "夏天到啦，节气真有趣！", "荷花开了，四四带你游！"],
  秋: ["秋天金灿灿的，一起探索吧！", "麦子成熟啦，快来学习！", "枫叶红了，节气奥秘等你！"],
  冬: ["冬天来了，一起探索节气吧！", "下雪啦，跟四四学节气！", "冬日暖暖，节气知识满满！"],
};

const quickCards = [
  {
    leftIcon: (
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36 }}>
        {/* 农民帽 */}
        <ellipse cx="20" cy="22" rx="16" ry="4" fill="#a0784a" opacity="0.9"/>
        <path d="M10 22 Q11 14 20 12 Q29 14 30 22Z" fill="#c9a25e"/>
        <ellipse cx="20" cy="12" rx="4" ry="2" fill="#8fba6a"/>
        {/* 嫩芽 */}
        <path d="M20 28 Q20 24 24 21" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="25" cy="20" rx="4" ry="2.5" fill="#7bc97a" transform="rotate(-20 25 20)"/>
      </svg>
    ),
    rightIcon: (
      <svg viewBox="0 0 36 36" fill="none" style={{ width: 32, height: 32 }}>
        {/* 嫩芽 */}
        <rect x="16" y="26" width="4" height="6" rx="2" fill="#8fba6a"/>
        <path d="M18 26 Q18 18 22 14" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="23" cy="13" rx="5.5" ry="3.5" fill="#7bc97a" transform="rotate(-25 23 13)"/>
        <path d="M18 24 Q16 20 12 18" stroke="#5BA883" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="11" cy="17" rx="5" ry="3" fill="#a0d88a" transform="rotate(15 11 17)"/>
      </svg>
    ),
    label: (t: string) => `${t}习俗故事`, path: "/customs",
  },
  {
    leftIcon: (
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36 }}>
        {/* 粽子 */}
        <path d="M20 8 L28 20 L20 32 L12 20 Z" fill="#6ab87a" opacity="0.9"/>
        <path d="M20 8 L28 20 L20 32" fill="#5BA883" opacity="0.6"/>
        <path d="M15 14 Q20 12 25 14" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M13 20 Q20 18 27 20" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
      </svg>
    ),
    rightIcon: (
      <svg viewBox="0 0 36 36" fill="none" style={{ width: 32, height: 32 }}>
        {/* 碗 */}
        <path d="M6 14 Q6 28 18 28 Q30 28 30 14 Z" fill="#6ab87a" opacity="0.85"/>
        <ellipse cx="18" cy="14" rx="12" ry="4" fill="#8fd4a0"/>
        <ellipse cx="18" cy="14" rx="8" ry="2.5" fill="#c8f0d8" opacity="0.6"/>
        {/* 筷子 */}
        <line x1="12" y1="6" x2="13" y2="15" stroke="#c9a25e" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="5" x2="17" y2="15" stroke="#c9a25e" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="8" y="28" width="20" height="3" rx="1.5" fill="#a0784a" opacity="0.7"/>
      </svg>
    ),
    label: (t: string) => `吃${t}饭`, path: "/folk-food",
  },
  {
    leftIcon: (
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 36, height: 36 }}>
        {/* 卷轴 */}
        <rect x="6" y="14" width="28" height="14" rx="3" fill="#d4a45a"/>
        <rect x="8" y="16" width="24" height="10" rx="2" fill="#f5e6c8"/>
        <rect x="6" y="12" width="28" height="4" rx="2" fill="#c9a25e"/>
        <rect x="6" y="26" width="28" height="4" rx="2" fill="#c9a25e"/>
        <circle cx="6" cy="14" r="3" fill="#a0784a"/>
        <circle cx="34" cy="14" r="3" fill="#a0784a"/>
        <circle cx="6" cy="28" r="3" fill="#a0784a"/>
        <circle cx="34" cy="28" r="3" fill="#a0784a"/>
        {/* 文字线条 */}
        <line x1="11" y1="20" x2="29" y2="20" stroke="#c9a25e" strokeWidth="1" opacity="0.7"/>
        <line x1="11" y1="23" x2="25" y2="23" stroke="#c9a25e" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    rightIcon: (
      <svg viewBox="0 0 36 36" fill="none" style={{ width: 32, height: 32 }}>
        {/* 竹简 */}
        <rect x="8" y="5" width="5" height="28" rx="2.5" fill="#c9a25e"/>
        <rect x="15" y="5" width="5" height="28" rx="2.5" fill="#d4b46a"/>
        <rect x="22" y="5" width="5" height="28" rx="2.5" fill="#c9a25e"/>
        <line x1="8" y1="12" x2="27" y2="12" stroke="#a07830" strokeWidth="1.5"/>
        <line x1="8" y1="24" x2="27" y2="24" stroke="#a07830" strokeWidth="1.5"/>
      </svg>
    ),
    label: (t: string) => `${t}古诗词`, path: "/poetry",
  },
];

function getChinaDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 8 * 3600000);
}
function getLunarDate() {
  const d = getChinaDate();
  const lunarMonths = ["正月","二月","三月","四月","五月","六月","七月","八月","九月","十月","冬月","腊月"];
  const lunarDays   = ["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"];
  return { month: lunarMonths[(d.getMonth() + 1) % 12], day: lunarDays[(d.getDate() - 1) % 30] };
}

/* 麦穗 SVG */
function WheatDecor({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 36 96" fill="none" className={className} style={style}>
      <line x1="18" y1="90" x2="18" y2="4" stroke="#c9a942" strokeWidth="2" strokeLinecap="round"/>
      {[12,20,28,36,44,52,60,68].map((y, i) => (
        <ellipse key={i}
          cx={18 + (i % 2 === 0 ? -10 : 10)} cy={y} rx="6.5" ry="4"
          fill="#e6c455" opacity="0.9"
          transform={`rotate(${i % 2 === 0 ? -35 : 35} ${18 + (i % 2 === 0 ? -10 : 10)} ${y})`}
        />
      ))}
    </svg>
  );
}

export default function HomePage() {
  const { lang } = useLanguage();
  const currentTerm = getCurrentSolarTerm();
  const nextTerm    = getNextSolarTerm();
  const d           = getChinaDate();
  const { month: lunarMonth, day: lunarDay } = getLunarDate();

  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [lineIdx]             = useState(() => Math.floor(Math.random() * 3));

  useEffect(() => {
    fetchCityWeather()
      .then(res => { setWeather(res.now); })
      .catch(() => {});
  }, []);

  const theme = seasonTheme[currentTerm.season] ?? seasonTheme["夏"];
  const lines = mascotLines[currentTerm.season] ?? mascotLines["夏"];
  const nextDate = new Date(d.getFullYear(), nextTerm.month - 1, nextTerm.day);
  const todayStr = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  return (
    <div className="overflow-y-auto relative z-10" style={{ background: "#dcf0e8", minHeight: "100%" }}>
      {/* 页面背景装饰：散落叶片+水滴+麦穗 */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* 左上叶片组 */}
        <svg viewBox="0 0 120 120" fill="none" style={{ position:"absolute", top:0, left:0, width:120, opacity:0.38 }}>
          <ellipse cx="30" cy="55" rx="28" ry="11" fill="#7EC878" transform="rotate(-45 30 55)"/>
          <ellipse cx="18" cy="85" rx="22" ry="9" fill="#A0D870" transform="rotate(-25 18 85)"/>
          <ellipse cx="60" cy="20" rx="20" ry="8" fill="#6EC060" transform="rotate(-60 60 20)"/>
        </svg>
        {/* 右上叶片 */}
        <svg viewBox="0 0 100 80" fill="none" style={{ position:"absolute", top:0, right:0, width:110, opacity:0.35 }}>
          <ellipse cx="80" cy="40" rx="26" ry="10" fill="#7EC878" transform="rotate(40 80 40)"/>
          <ellipse cx="50" cy="15" rx="22" ry="8" fill="#A0D870" transform="rotate(60 50 15)"/>
        </svg>
        {/* 左下麦穗 */}
        <svg viewBox="0 0 60 100" fill="none" style={{ position:"absolute", bottom:20, left:8, width:60, opacity:0.4 }}>
          <line x1="30" y1="98" x2="30" y2="22" stroke="#c9a942" strokeWidth="1.8" strokeLinecap="round"/>
          {[26,34,42,50,58,66,74,82].map((y,i)=>(
            <ellipse key={i} cx={30+(i%2===0?-9:9)} cy={y} rx="6" ry="3.2" fill="#e6c455" opacity="0.88"
              transform={`rotate(${i%2===0?-35:35} ${30+(i%2===0?-9:9)} ${y})`}/>
          ))}
        </svg>
        {/* 右下叶片 */}
        <svg viewBox="0 0 90 80" fill="none" style={{ position:"absolute", bottom:0, right:0, width:100, opacity:0.32 }}>
          <ellipse cx="70" cy="60" rx="25" ry="10" fill="#7EC878" transform="rotate(35 70 60)"/>
          <ellipse cx="45" cy="75" rx="20" ry="8" fill="#A0D870" transform="rotate(15 45 75)"/>
        </svg>
        {/* 散落水滴 */}
        {[[20,40],[85,25],[92,68],[10,72],[55,12],[78,88]].map(([x,y],i)=>(
          <svg key={i} viewBox="0 0 16 20" fill="none" style={{ position:"absolute", left:`${x}%`, top:`${y}%`, width:14, opacity:0.45 }}>
            <path d="M8 2 Q14 8 14 13 A6 6 0 0 1 2 13 Q2 8 8 2Z" fill="#5BC8D8"/>
          </svg>
        ))}
      </div>

      <div className="relative px-4 py-4 max-w-full space-y-4" style={{ zIndex: 1 }}>

        {/* ── Hero：左节气大字卡 + 右吉祥物区 ── */}
        <div className="flex flex-col md:flex-row items-stretch gap-4">

            {/* 左：奶黄大卡 */}
            <div
              className="relative rounded-[1.5rem] flex flex-col justify-between px-5 py-5 overflow-hidden min-h-[260px] md:min-h-0 w-full md:basis-[58%] md:shrink-0"
              style={{
                background: "#FEF9E7",
                border: "2.5px solid #B8D89A",
                boxShadow: "0 4px 18px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              {/* ── 芒种主题精彩儿童背景绘图 ── */}
              <svg
                viewBox="0 0 300 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ opacity: 0.38 }}
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <radialGradient id="bg-sun" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#FFE566"/>
                    <stop offset="60%" stopColor="#FFB830"/>
                    <stop offset="100%" stopColor="#FF8C00"/>
                  </radialGradient>
                  <radialGradient id="bg-wheat" cx="50%" cy="20%">
                    <stop offset="0%" stopColor="#FFDF70"/>
                    <stop offset="100%" stopColor="#D4A017"/>
                  </radialGradient>
                  <radialGradient id="bg-cloud" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#fff"/>
                    <stop offset="100%" stopColor="#e0f4ff"/>
                  </radialGradient>
                  <radialGradient id="bg-plum" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#a8e063"/>
                    <stop offset="100%" stopColor="#56b300"/>
                  </radialGradient>
                  <radialGradient id="bg-butterfly1" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#ffb3d9"/>
                    <stop offset="100%" stopColor="#e0006b"/>
                  </radialGradient>
                  <radialGradient id="bg-butterfly2" cx="40%" cy="30%">
                    <stop offset="0%" stopColor="#ffe0a0"/>
                    <stop offset="100%" stopColor="#ff8800"/>
                  </radialGradient>
                  <linearGradient id="bg-stem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7acc50"/>
                    <stop offset="100%" stopColor="#3a8a20"/>
                  </linearGradient>
                </defs>

                {/* ── 太阳（左上）── */}
                <circle cx="26" cy="28" r="17" fill="url(#bg-sun)" opacity="0.9"/>
                <circle cx="26" cy="28" r="10" fill="#FFE566" opacity="0.6"/>
                {/* 光芒 */}
                {[0,40,80,120,160,200,240,280,320].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 26 + 19 * Math.cos(rad);
                  const y1 = 28 + 19 * Math.sin(rad);
                  const x2 = 26 + 30 * Math.cos(rad);
                  const y2 = 28 + 30 * Math.sin(rad);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFD000" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>;
                })}
                {/* 太阳高光 */}
                <circle cx="21" cy="23" r="4" fill="#fff" opacity="0.35"/>

                {/* ── 白云（右上）── */}
                <circle cx="240" cy="22" r="14" fill="url(#bg-cloud)" opacity="0.9"/>
                <circle cx="258" cy="18" r="18" fill="url(#bg-cloud)" opacity="0.9"/>
                <circle cx="275" cy="24" r="12" fill="url(#bg-cloud)" opacity="0.85"/>
                <circle cx="252" cy="30" r="11" fill="url(#bg-cloud)" opacity="0.85"/>
                <circle cx="268" cy="32" r="9" fill="url(#bg-cloud)" opacity="0.8"/>

                {/* ── 彩带飘扬（送花神）── */}
                <path d="M60 5 Q80 18 100 8 Q120 0 140 12" stroke="#ff6eb4" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85"/>
                <path d="M90 0 Q110 15 130 5 Q150 -5 170 10" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
                <path d="M150 8 Q170 22 190 10 Q210 0 230 14" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
                <path d="M55 15 Q75 2 95 14" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>

                {/* ── 飘落花瓣（送花神）── */}
                <ellipse cx="75" cy="55" rx="6" ry="3.5" fill="#ffb3d9" opacity="0.8" transform="rotate(-35 75 55)"/>
                <ellipse cx="120" cy="42" rx="5" ry="3" fill="#c4b5fd" opacity="0.8" transform="rotate(20 120 42)"/>
                <ellipse cx="200" cy="60" rx="6" ry="3.5" fill="#fda4af" opacity="0.8" transform="rotate(45 200 60)"/>
                <ellipse cx="260" cy="55" rx="5" ry="3" fill="#86efac" opacity="0.7" transform="rotate(-20 260 55)"/>
                <ellipse cx="170" cy="38" rx="4" ry="2.5" fill="#fbbf24" opacity="0.8" transform="rotate(60 170 38)"/>
                <ellipse cx="48" cy="70" rx="5" ry="3" fill="#f9a8d4" opacity="0.75" transform="rotate(-50 48 70)"/>
                <ellipse cx="222" cy="45" rx="4.5" ry="2.8" fill="#a5f3fc" opacity="0.7" transform="rotate(30 222 45)"/>
                <ellipse cx="140" cy="65" rx="5" ry="3" fill="#fdba74" opacity="0.75" transform="rotate(-15 140 65)"/>

                {/* ── 青梅（左中）── */}
                <circle cx="55" cy="105" r="11" fill="url(#bg-plum)" opacity="0.9"/>
                <circle cx="55" cy="105" r="7" fill="#c5f27a" opacity="0.5"/>
                <circle cx="51" cy="101" r="3" fill="#fff" opacity="0.3"/>
                {/* 梗 */}
                <line x1="55" y1="94" x2="55" y2="99" stroke="#5a9e20" strokeWidth="1.8" strokeLinecap="round"/>
                <ellipse cx="57" cy="91" rx="5" ry="2.5" fill="#7acc50" opacity="0.8" transform="rotate(-30 57 91)"/>
                {/* 第二颗 */}
                <circle cx="70" cy="115" r="9" fill="url(#bg-plum)" opacity="0.8"/>
                <circle cx="67" cy="112" r="2.5" fill="#fff" opacity="0.3"/>
                <line x1="70" y1="106" x2="70" y2="110" stroke="#5a9e20" strokeWidth="1.5" strokeLinecap="round"/>

                {/* ── 螳螂（右中，芒种一候螳螂生）── */}
                {/* 身体 */}
                <ellipse cx="248" cy="110" rx="6" ry="14" fill="#5cc96a" opacity="0.9" transform="rotate(-15 248 110)"/>
                {/* 头 */}
                <circle cx="240" cy="98" r="7" fill="#4aba58" opacity="0.9"/>
                <circle cx="238" cy="96" r="2.5" fill="#1a5c20" opacity="0.8"/>
                <circle cx="244" cy="95" r="2.5" fill="#1a5c20" opacity="0.8"/>
                {/* 大镰刀前臂 */}
                <path d="M237 103 Q228 95 225 85" stroke="#3aa845" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <path d="M225 85 Q220 80 222 90" stroke="#3aa845" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M243 102 Q252 94 255 83" stroke="#3aa845" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <path d="M255 83 Q260 78 258 88" stroke="#3aa845" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                {/* 腿 */}
                <line x1="244" y1="112" x2="258" y2="122" stroke="#4aba58" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                <line x1="243" y1="118" x2="256" y2="130" stroke="#4aba58" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
                {/* 翅膀 */}
                <ellipse cx="252" cy="108" rx="8" ry="5" fill="#86efac" opacity="0.6" transform="rotate(10 252 108)"/>

                {/* ── 蝴蝶1（粉色，中上）── */}
                {/* 上翅 */}
                <ellipse cx="145" cy="52" rx="16" ry="10" fill="url(#bg-butterfly1)" opacity="0.85" transform="rotate(-25 145 52)"/>
                <ellipse cx="168" cy="48" rx="13" ry="8" fill="url(#bg-butterfly1)" opacity="0.8" transform="rotate(20 168 48)"/>
                {/* 下翅 */}
                <ellipse cx="149" cy="66" rx="11" ry="7" fill="#ff80c0" opacity="0.75" transform="rotate(20 149 66)"/>
                <ellipse cx="163" cy="63" rx="9" ry="6" fill="#ff80c0" opacity="0.7" transform="rotate(-15 163 63)"/>
                {/* 身体 */}
                <ellipse cx="156" cy="57" rx="2.5" ry="8" fill="#c0005a" opacity="0.9"/>
                {/* 触角 */}
                <path d="M155 50 Q150 42 148 38" stroke="#c0005a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <circle cx="148" cy="37" r="1.8" fill="#c0005a"/>
                <path d="M157 50 Q162 42 164 38" stroke="#c0005a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <circle cx="164" cy="37" r="1.8" fill="#c0005a"/>
                {/* 翅膀纹路 */}
                <circle cx="148" cy="52" r="2.5" fill="#fff" opacity="0.4"/>
                <circle cx="164" cy="49" r="2" fill="#fff" opacity="0.4"/>
                <circle cx="151" cy="64" r="2" fill="#fff" opacity="0.35"/>

                {/* ── 蝴蝶2（橙色，右侧）── */}
                <ellipse cx="218" cy="85" rx="13" ry="8" fill="url(#bg-butterfly2)" opacity="0.8" transform="rotate(-30 218 85)"/>
                <ellipse cx="238" cy="82" rx="11" ry="7" fill="url(#bg-butterfly2)" opacity="0.75" transform="rotate(25 238 82)"/>
                <ellipse cx="221" cy="96" rx="9" ry="6" fill="#ffaa40" opacity="0.7" transform="rotate(15 221 96)"/>
                <ellipse cx="235" cy="93" rx="8" ry="5" fill="#ffaa40" opacity="0.65" transform="rotate(-20 235 93)"/>
                <ellipse cx="228" cy="89" rx="2" ry="7" fill="#c05800" opacity="0.85"/>
                <path d="M227 83 Q223 75 221 71" stroke="#c05800" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <circle cx="221" cy="70" r="1.5" fill="#c05800"/>
                <path d="M229 83 Q233 75 235 71" stroke="#c05800" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <circle cx="235" cy="70" r="1.5" fill="#c05800"/>
                <circle cx="222" cy="84" r="2" fill="#fff" opacity="0.4"/>
                <circle cx="236" cy="82" r="1.8" fill="#fff" opacity="0.35"/>

                {/* ── 麦穗群（底部）── */}
                {[
                  { x: 15,  h: 60, tilt: -8  },
                  { x: 40,  h: 72, tilt: 5   },
                  { x: 68,  h: 58, tilt: -12 },
                  { x: 95,  h: 70, tilt: 8   },
                  { x: 122, h: 64, tilt: -6  },
                  { x: 155, h: 75, tilt: 4   },
                  { x: 182, h: 62, tilt: -10 },
                  { x: 200, h: 68, tilt: 7   },
                  { x: 270, h: 65, tilt: -7  },
                  { x: 288, h: 70, tilt: 6   },
                ].map(({ x, h, tilt }, idx) => {
                  const by = 200;
                  const tx = x + Math.sin((tilt * Math.PI) / 180) * h * 0.5;
                  const ty = by - h;
                  return (
                    <g key={idx}>
                      {/* 茎 */}
                      <line x1={x} y1={by} x2={tx} y2={ty} stroke="url(#bg-stem)" strokeWidth="2.2" strokeLinecap="round"/>
                      {/* 麦粒 - 从顶部向下每8px放一对 */}
                      {[0,8,16,24,32,40].map((offset, gi) => {
                        const py = ty + offset;
                        const px = tx + Math.sin((tilt * Math.PI) / 180) * offset * 0.5;
                        return (
                          <g key={gi}>
                            <ellipse cx={px - 5} cy={py} rx="4.5" ry="2.5" fill="url(#bg-wheat)" opacity="0.92"
                              transform={`rotate(${tilt - 35} ${px - 5} ${py})`}/>
                            <ellipse cx={px + 5} cy={py} rx="4.5" ry="2.5" fill="url(#bg-wheat)" opacity="0.88"
                              transform={`rotate(${tilt + 35} ${px + 5} ${py})`}/>
                            {/* 高光 */}
                            <ellipse cx={px - 5.5} cy={py - 0.8} rx="1.5" ry="0.8" fill="#fff" opacity="0.3"
                              transform={`rotate(${tilt - 35} ${px - 5.5} ${py - 0.8})`}/>
                          </g>
                        );
                      })}
                      {/* 顶芒 */}
                      <line x1={tx} y1={ty} x2={tx - 2} y2={ty - 8} stroke="#D4A017" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
                    </g>
                  );
                })}

                {/* ── 小草点缀（底部）── */}
                {[30, 80, 110, 140, 168, 228, 255].map((gx, i) => (
                  <g key={i}>
                    <path d={`M${gx} 195 Q${gx - 6} 183 ${gx - 4} 177`} stroke="#5cc96a" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
                    <path d={`M${gx} 195 Q${gx + 7} 181 ${gx + 5} 174`} stroke="#7acc50" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
                    <path d={`M${gx} 195 Q${gx} 184 ${gx + 1} 178`} stroke="#4aba58" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                  </g>
                ))}

                {/* ── 水波纹（底部，小满/芒种水意象）── */}
                <path d="M0 190 Q40 184 80 190 Q120 196 160 190 Q200 184 240 190 Q270 194 300 190" stroke="#5bc8d8" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
                <path d="M0 196 Q50 191 100 196 Q150 201 200 196 Q250 191 300 196" stroke="#4db8ca" strokeWidth="1.2" fill="none" opacity="0.3" strokeLinecap="round"/>

                {/* ── 小星星点缀 ── */}
                {[
                  [105,28],[185,20],[300-60,40],[88,78],[210,72],[40,130],[280,120]
                ].map(([sx, sy], i) => (
                  <g key={i}>
                    <path d={`M${sx} ${sy - 4} L${sx + 1.2} ${sy - 1.2} L${sx + 4} ${sy - 1.2} L${sx + 2} ${sy + 1} L${sx + 2.5} ${sy + 4} L${sx} ${sy + 2.5} L${sx - 2.5} ${sy + 4} L${sx - 2} ${sy + 1} L${sx - 4} ${sy - 1.2} L${sx - 1.2} ${sy - 1.2}Z`}
                      fill="#FFD700" opacity="0.7"/>
                  </g>
                ))}

              </svg>

              {/* 左下麦穗装饰 */}
              <div className="absolute left-0 bottom-0 pointer-events-none select-none" style={{ width: 76, opacity: 0.85 }}>
                <svg viewBox="0 0 56 60" fill="none" style={{ width: 76, height: 82 }}>
                  <ellipse cx="18" cy="44" rx="9" ry="4.5" fill="#7EC878" transform="rotate(-40 18 44)"/>
                  <ellipse cx="10" cy="52" rx="7" ry="3.5" fill="#A0D870" transform="rotate(-20 10 52)"/>
                  <line x1="28" y1="58" x2="28" y2="20" stroke="#c9a942" strokeWidth="1.8" strokeLinecap="round"/>
                  {[24,30,36,42,48].map((y,i)=>(
                    <ellipse key={i} cx={28+(i%2===0?-7:7)} cy={y} rx="5" ry="3"
                      fill="#e6c455" opacity="0.9"
                      transform={`rotate(${i%2===0?-35:35} ${28+(i%2===0?-7:7)} ${y})`}/>
                  ))}
                </svg>
              </div>
              {/* 右下麦穗装饰 */}
              <div className="absolute right-0 bottom-0 pointer-events-none select-none" style={{ width: 72, opacity: 0.85 }}>
                <svg viewBox="0 0 52 60" fill="none" style={{ width: 72, height: 82 }}>
                  <ellipse cx="34" cy="44" rx="9" ry="4.5" fill="#7EC878" transform="rotate(40 34 44)"/>
                  <ellipse cx="42" cy="52" rx="7" ry="3.5" fill="#A0D870" transform="rotate(20 42 52)"/>
                  <line x1="24" y1="58" x2="24" y2="20" stroke="#c9a942" strokeWidth="1.8" strokeLinecap="round"/>
                  {[24,30,36,42,48].map((y,i)=>(
                    <ellipse key={i} cx={24+(i%2===0?7:-7)} cy={y} rx="5" ry="3"
                      fill="#e6c455" opacity="0.9"
                      transform={`rotate(${i%2===0?35:-35} ${24+(i%2===0?7:-7)} ${y})`}/>
                  ))}
                </svg>
              </div>
              {/* 右上小叶片装饰 */}
              <div className="absolute right-3 top-2 pointer-events-none select-none opacity-50">
                <svg viewBox="0 0 20 20" fill="none" style={{ width: 22, height: 22 }}>
                  <ellipse cx="10" cy="10" rx="7" ry="3.5" fill="#6EC060" transform="rotate(-30 10 10)"/>
                </svg>
              </div>

              {/* 节气小标签 — 居中 */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-base">{theme.emoji}</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: "#D4EDBC", color: "#2d6b4a" }}>
                  当前节气 · {currentTerm.season}季
                </span>
              </div>

              {/* 超大节气名 — 深青绿字体，居中 */}
              <h1
                className="font-black leading-none tracking-tight my-2 text-center w-full"
                style={{
                  fontSize: "clamp(64px, 16vw, 108px)",
                  color: "#1B7A6A",
                  textShadow: "0 2px 12px rgba(27,122,106,0.22), 0 1px 0 rgba(80,200,160,0.35)",
                  WebkitTextStroke: "0.5px rgba(27,122,106,0.2)",
                }}
              >
                {currentTerm.name}
              </h1>

              {/* 日期 — 居中 */}
              <p className="text-sm font-semibold text-center" style={{ color: "#2a7060" }}>
                约 {currentTerm.date}「{currentTerm.season}季」
              </p>
            </div>

            {/* 右：对话气泡 + 距下节气 + 吉祥物 + CTA */}
            <div
              className="flex-1 flex flex-col items-center justify-between py-3 pl-0 md:pl-2"
              style={{ minWidth: 0 }}
            >

              {/* 对话气泡 */}
              <div
                className="relative rounded-2xl px-3.5 py-3 text-sm font-semibold leading-snug w-full"
                style={{
                  background: "#fff",
                  color: theme.heroFg,
                  border: "1.5px solid #B8EDE8",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                }}
              >
              小鹿说：{lines[lineIdx]}
                <span className="absolute -bottom-[8px] left-6"
                  style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "8px solid #c4922a" }} />
              </div>

              {/* 吉祥物立绘 */}
              <img
                src={MASCOT_IMG}
                alt="四四小鹿"
                className="animate-float"
                style={{
                  width: "clamp(80px, 22vw, 160px)",
                  height: "auto",
                  maxHeight: 200,
                  borderRadius: "1.5rem",
                  border: "3px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 8px 28px rgba(91,168,131,0.28)",
                  objectFit: "cover",
                  objectPosition: "top",
                  marginTop: 8, marginBottom: 4,
                }}
              />

              {/* 距下节气 */}
              <p className="text-xs font-semibold text-center" style={{ color: "#3d7a68" }}>
                {lang === "en" ? <>Next solar term in {nextTerm.season} days</> : <>距下节气「{nextTerm.season}天」</>}
              </p>

              {/* 两个大 CTA */}
              <div className="flex flex-row gap-2 w-full mt-2">
                <Link
                  to={`/solar-term/${currentTerm.id}`}
                  className="flex-1 flex items-center justify-center font-black btn-child-press"
                  style={{
                    background: "#4ECDC4", color: "#fff",
                    height: 52, borderRadius: "1.4rem", fontSize: 18,
                    boxShadow: "0 4px 16px rgba(78,205,196,0.45)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {lang === "en" ? "Story Time" : "听故事"}
                </Link>
                <Link
                  to={`/solar-term/${currentTerm.id}`}
                  className="flex-1 flex items-center justify-center font-black btn-child-press"
                  style={{
                    background: "#b898e2", color: "#fff",
                    height: 52, borderRadius: "1.4rem", fontSize: 18,
                    boxShadow: "0 4px 16px rgba(184,152,226,0.45)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {lang === "en" ? "Explore!" : "去探险"}
                </Link>
              </div>
            </div>
          </div>

        {/* ── 信息区：两行四列布局（参考图宽屏样式）── */}
        {/* 第一行：今日天气 | 月日农历 | 芒种饮食 | 芒种着装 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* 天气卡 — 横排：左图标+右文字 */}
          <div className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-3 min-h-[88px]"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 56 56" fill="none" style={{ width: 56, height: 56, flexShrink: 0 }}>
              <defs>
                <radialGradient id="wic-sun" cx="40%" cy="35%"><stop offset="0%" stopColor="#FFE566"/><stop offset="100%" stopColor="#FF9500"/></radialGradient>
                <radialGradient id="wic-cloud" cx="45%" cy="40%"><stop offset="0%" stopColor="#e8f4ff"/><stop offset="100%" stopColor="#b8d8f8"/></radialGradient>
              </defs>
              <circle cx="20" cy="18" r="10" fill="url(#wic-sun)"/>
              <circle cx="17" cy="15" r="3" fill="#fff" opacity="0.38"/>
              {[0,45,90,135,180,225,270,315].map((deg,i)=>{const r=(deg*Math.PI)/180;return <line key={i} x1={20+12*Math.cos(r)} y1={18+12*Math.sin(r)} x2={20+17*Math.cos(r)} y2={18+17*Math.sin(r)} stroke="#FFB830" strokeWidth="2.5" strokeLinecap="round"/>;})}
              <circle cx="24" cy="36" r="8" fill="url(#wic-cloud)"/>
              <circle cx="34" cy="33" r="10" fill="url(#wic-cloud)"/>
              <circle cx="45" cy="37" r="7" fill="url(#wic-cloud)"/>
              <rect x="16" y="36" width="36" height="9" rx="4.5" fill="url(#wic-cloud)"/>
              <ellipse cx="31" cy="31" rx="8" ry="3" fill="#fff" opacity="0.4"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-muted-foreground font-medium leading-none">今日天气</p>
              <p className="font-black leading-tight" style={{ fontSize: 20, color: "#1B7A6A" }}>
                {weather ? `${weather.temp}°` : "--°"}
              </p>
              <p className="text-xs font-semibold leading-none truncate" style={{ color: "#5a9c82" }}>
                {weather ? `${getWeatherEmoji(weather.text)} ${weather.text}` : "⛅ 加载中"} 东风
              </p>
            </div>
          </div>

          {/* 农历卡 — 横排：左农历盘图标+右文字 */}
          <div className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-3 min-h-[88px]"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 56 56" fill="none" style={{ width: 56, height: 56, flexShrink: 0 }}>
              <defs>
                <radialGradient id="cal-bg" cx="50%" cy="45%"><stop offset="0%" stopColor="#fffbe6"/><stop offset="100%" stopColor="#fde68a"/></radialGradient>
                <radialGradient id="cal-red" cx="50%" cy="40%"><stop offset="0%" stopColor="#fca5a5"/><stop offset="100%" stopColor="#dc2626"/></radialGradient>
              </defs>
              {/* 日历主体 */}
              <rect x="4" y="10" width="48" height="42" rx="8" fill="url(#cal-bg)"/>
              {/* 顶部红色标题栏 */}
              <rect x="4" y="10" width="48" height="16" rx="8" fill="url(#cal-red)"/>
              <rect x="4" y="18" width="48" height="8" fill="#dc2626"/>
              {/* 日历圆孔 */}
              <circle cx="18" cy="10" r="4" fill="#1B7A6A"/>
              <circle cx="18" cy="10" r="2.5" fill="#fff"/>
              <circle cx="38" cy="10" r="4" fill="#1B7A6A"/>
              <circle cx="38" cy="10" r="2.5" fill="#fff"/>
              {/* 顶部文字区域 */}
              <text x="28" y="21" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">农历</text>
              {/* 大数字区域 */}
              <rect x="8" y="29" width="40" height="18" rx="4" fill="#fff" opacity="0.7"/>
              {/* 农历日期符号 */}
              <text x="28" y="42" textAnchor="middle" fontSize="11" fill="#dc2626" fontWeight="bold">十九</text>
              {/* 底部星期行 */}
              {["日","一","二","三","四","五","六"].map((w,i)=>(
                <text key={i} x={8+i*7} y="53" fontSize="5.5" fill={i===0?"#dc2626":"#6b7280"} opacity="0.85">{w}</text>
              ))}
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-muted-foreground font-medium leading-none">月日农历</p>
              <p className="font-black leading-tight text-center" style={{ fontSize: 17, color: "#1B7A6A" }}>
                {lunarMonth}{lunarDay}
              </p>
              <p className="text-xs font-semibold leading-none truncate" style={{ color: "#5a9c82" }}>{todayStr.slice(5)}</p>
            </div>
          </div>

          {/* 芒种饮食卡 — 横排：左粽子图标+右文字 */}
          <Link to="/folk-food"
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-3 min-h-[88px] btn-child-press"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 56 56" fill="none" style={{ width: 56, height: 56, flexShrink: 0 }}>
              <defs>
                <radialGradient id="food-zongzi" cx="45%" cy="35%"><stop offset="0%" stopColor="#7de89a"/><stop offset="100%" stopColor="#2d8f52"/></radialGradient>
              </defs>
              <path d="M28 6 L40 26 L28 46 L16 26Z" fill="url(#food-zongzi)" opacity="0.95"/>
              <path d="M28 6 L40 26 L28 46" fill="#1e7040" opacity="0.45"/>
              <path d="M22 17 Q28 14 34 17" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.75"/>
              <path d="M18 26 Q28 22 38 26" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55"/>
              <line x1="28" y1="4" x2="28" y2="9" stroke="#a0d870" strokeWidth="2.2" strokeLinecap="round"/>
              <ellipse cx="28" cy="3" rx="5" ry="2.5" fill="#7bc97a" opacity="0.85"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-muted-foreground font-medium leading-none">民间饮食</p>
              <p className="text-sm font-black leading-tight" style={{ color: "#1B7A6A" }}>芒种饮食</p>
            </div>
          </Link>

          {/* 芒种着装卡 — 横排：左草帽小人+右文字 */}
          <Link to="/customs"
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-3 min-h-[88px] btn-child-press"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 56 56" fill="none" style={{ width: 56, height: 56, flexShrink: 0 }}>
              <defs>
                <radialGradient id="cloth-hat" cx="50%" cy="30%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/></radialGradient>
                <radialGradient id="cloth-body" cx="45%" cy="30%"><stop offset="0%" stopColor="#a8d8f0"/><stop offset="100%" stopColor="#4a9ecc"/></radialGradient>
              </defs>
              {/* 草帽 */}
              <ellipse cx="28" cy="20" rx="20" ry="5.5" fill="#d97706" opacity="0.8"/>
              <ellipse cx="28" cy="20" rx="20" ry="4.5" fill="url(#cloth-hat)"/>
              <path d="M14 20 Q15.5 12 28 9 Q40.5 12 42 20Z" fill="#fcd34d"/>
              <ellipse cx="28" cy="9" rx="5" ry="2.5" fill="#a0d870"/>
              {/* 人物身体 */}
              <circle cx="28" cy="26" r="5" fill="#f9d5a3"/>
              <ellipse cx="28" cy="36" rx="7" ry="9" fill="url(#cloth-body)"/>
              {/* 领口花纹 */}
              <path d="M22 29 Q28 32 34 29" stroke="#2a6e8c" strokeWidth="1.2" fill="none" opacity="0.6"/>
              {/* 手臂 */}
              <line x1="21" y1="32" x2="15" y2="40" stroke="#4a9ecc" strokeWidth="3" strokeLinecap="round"/>
              <line x1="35" y1="32" x2="41" y2="40" stroke="#4a9ecc" strokeWidth="3" strokeLinecap="round"/>
              {/* 腿 */}
              <line x1="24" y1="45" x2="22" y2="53" stroke="#2d5f7a" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="45" x2="34" y2="53" stroke="#2d5f7a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-muted-foreground font-medium leading-none">夏日穿搭</p>
              <p className="text-sm font-black leading-tight" style={{ color: "#1B7A6A" }}>芒种着装</p>
            </div>
          </Link>
        </div>

        {/* 第二行：芒种故事 | 芒种习俗 | 芒种古诗词 | 预留 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* 芒种故事卡 */}
          <Link to={`/solar-term/${currentTerm.id}`}
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-2 min-h-[88px] btn-child-press"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48, flexShrink: 0 }}>
              <defs>
                <linearGradient id="book-cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6ee7b7"/><stop offset="100%" stopColor="#047857"/></linearGradient>
              </defs>
              <rect x="6" y="6" width="30" height="38" rx="4" fill="url(#book-cover)"/>
              <rect x="10" y="6" width="26" height="38" rx="3" fill="#f0fdf4"/>
              <rect x="6" y="6" width="6" height="38" rx="3" fill="#065f46"/>
              <line x1="14" y1="16" x2="32" y2="16" stroke="#059669" strokeWidth="1.5" opacity="0.6"/>
              <line x1="14" y1="21" x2="32" y2="21" stroke="#059669" strokeWidth="1.2" opacity="0.45"/>
              <line x1="14" y1="26" x2="28" y2="26" stroke="#059669" strokeWidth="1.2" opacity="0.45"/>
              {/* 读书小人 */}
              <circle cx="34" cy="28" r="5" fill="#f9d5a3"/>
              <ellipse cx="34" cy="38" rx="5" ry="6" fill="#60a5fa"/>
              <line x1="29" y1="32" x2="24" y2="36" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="39" y1="32" x2="44" y2="36" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs font-medium leading-none" style={{ color: "#5a9c82" }}>节气故事</p>
              <p className="text-sm font-black leading-tight" style={{ color: "#1B7A6A" }}>芒种故事</p>
            </div>
          </Link>

          {/* 芒种习俗卡 */}
          <Link to="/customs"
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-2 min-h-[88px] btn-child-press"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48, flexShrink: 0 }}>
              <defs>
                <radialGradient id="basket-bg" cx="45%" cy="35%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#92400e"/></radialGradient>
              </defs>
              {/* 竹篮主体 */}
              <path d="M8 20 Q8 40 24 40 Q40 40 40 20Z" fill="url(#basket-bg)" opacity="0.9"/>
              <ellipse cx="24" cy="20" rx="16" ry="6" fill="#fcd34d"/>
              {/* 编织纹路 */}
              {[24,29,34].map((y,i)=>(
                <path key={i} d={`M10 ${y} Q24 ${y-3} 38 ${y}`} stroke="#b45309" strokeWidth="1" fill="none" opacity="0.45"/>
              ))}
              {[12,18,24,30,36].map((x,i)=>(
                <line key={i} x1={x} y1="20" x2={x+(x<24?-2:2)} y2="40" stroke="#b45309" strokeWidth="0.9" opacity="0.3"/>
              ))}
              {/* 提手 */}
              <path d="M16 20 Q16 8 24 8 Q32 8 32 20" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {/* 篮中农作物 */}
              <ellipse cx="24" cy="19" rx="10" ry="4" fill="#a0d870" opacity="0.85"/>
              <circle cx="20" cy="17" r="3.5" fill="#5ba882" opacity="0.9"/>
              <circle cx="28" cy="17" r="3.5" fill="#4aba58" opacity="0.9"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs font-medium leading-none" style={{ color: "#5a9c82" }}>传统习俗</p>
              <p className="text-sm font-black leading-tight" style={{ color: "#1B7A6A" }}>芒种习俗</p>
            </div>
          </Link>

          {/* 芒种古诗词卡 */}
          <Link to="/poetry"
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center gap-2 min-h-[88px] btn-child-press"
            style={{ background: "#fff", border: "1.5px solid rgba(180,220,200,0.6)", boxShadow: "var(--shadow-card)" }}>
            <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, height: 48, flexShrink: 0 }}>
              <defs>
                <linearGradient id="scroll-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/></linearGradient>
                <linearGradient id="paper-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffbeb"/><stop offset="100%" stopColor="#fef3c7"/></linearGradient>
              </defs>
              <rect x="5" y="16" width="38" height="19" rx="4" fill="url(#scroll-grad)"/>
              <rect x="8" y="19" width="32" height="13" rx="2.5" fill="url(#paper-grad)"/>
              <line x1="12" y1="24" x2="36" y2="24" stroke="#b45309" strokeWidth="1.2" opacity="0.55"/>
              <line x1="12" y1="28" x2="30" y2="28" stroke="#b45309" strokeWidth="1.2" opacity="0.45"/>
              <rect x="5" y="12" width="38" height="6" rx="3" fill="#b45309"/>
              <rect x="5" y="33" width="38" height="6" rx="3" fill="#b45309"/>
              {[[5,15],[43,15],[5,36],[43,36]].map(([ax,ay],i)=>(
                <g key={i}><circle cx={ax} cy={ay} r="5" fill="#7c2d12"/><circle cx={ax} cy={ay} r="3" fill="#ef4444"/></g>
              ))}
              <rect x="28" y="20" width="7" height="9" rx="1.5" fill="#dc2626" opacity="0.8"/>
              <line x1="30" y1="23" x2="34" y2="23" stroke="#fff" strokeWidth="1" opacity="0.8"/>
              <line x1="30" y1="26" x2="34" y2="26" stroke="#fff" strokeWidth="1" opacity="0.8"/>
            </svg>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs font-medium leading-none" style={{ color: "#5a9c82" }}>古典诗词</p>
              <p className="text-sm font-black leading-tight" style={{ color: "#1B7A6A" }}>芒种古诗词</p>
            </div>
          </Link>

          {/* 预留格 — 装饰性空格 */}
          <div
            className="rounded-[1.4rem] px-3 py-3 flex flex-row items-center justify-center gap-2 min-h-[88px]"
            style={{ background: "rgba(255,255,255,0.55)", border: "1.5px dashed rgba(150,210,180,0.6)" }}>
            <svg viewBox="0 0 48 48" fill="none" style={{ width: 36, height: 36, opacity: 0.45 }}>
              <circle cx="24" cy="24" r="18" stroke="#5BA883" strokeWidth="2" strokeDasharray="4,3"/>
              <line x1="24" y1="14" x2="24" y2="34" stroke="#5BA883" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="14" y1="24" x2="34" y2="24" stroke="#5BA883" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <p className="text-xs font-semibold" style={{ color: "#8BBFA8" }}>更多内容</p>
          </div>
        </div>

      </div>
    </div>
  );
}
