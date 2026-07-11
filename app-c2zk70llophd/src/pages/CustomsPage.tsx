import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { solarTerms } from "@/data/solarTerms";
import { localizeTerm } from "@/data/localizeTerm";
import { termNameEn } from "@/data/solarTermsEn";

const MASCOT_IMG = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

const seasonConfig = {
  春: { emoji: "🌱", activeBg: "#5BA883", activeFg: "#fff", passiveBg: "#EAF7EE", passiveFg: "#1E5C35", cardBg: "#FFF9F0", glowColor: "#5BA883" },
  夏: { emoji: "🌿", activeBg: "#4ECDC4", activeFg: "#fff", passiveBg: "#D8F2ED", passiveFg: "#1A4D45", cardBg: "#EAF9F7", glowColor: "#4ECDC4" },
  秋: { emoji: "🍂", activeBg: "#E8A87C", activeFg: "#fff", passiveBg: "#FEF3DF", passiveFg: "#5C3A10", cardBg: "#FFF8F0", glowColor: "#E8A87C" },
  冬: { emoji: "❄️", activeBg: "#6BA3D6", activeFg: "#fff", passiveBg: "#E3EFF9", passiveFg: "#1A3A5C", cardBg: "#EEF6FF", glowColor: "#6BA3D6" },
} as const;

const seasons = ["春", "夏", "秋", "冬"] as const;
const seasonEn: Record<string, string> = { 春: "Spring", 夏: "Summer", 秋: "Autumn", 冬: "Winter" };

const customsImages: Record<string, string> = {
  lichun:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ed8a6bb8-f2d5-430a-8415-10ca3c5fb808.jpg",
  yushui:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_74ebe2d1-fed3-4643-aae0-0cf874633cf5.jpg",
  jingzhe:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9c2fbc45-7285-4bb2-b42e-645a731116c7.jpg",
  chunfen:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cdc9d7c2-0ca0-42a3-a0ff-04035469dd0f.jpg",
  qingming:   "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_13f2a19b-0748-4fb1-b44c-9864808a27e5.jpg",
  guyu:       "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4f011915-745e-4924-835f-2a82a33304e3.jpg",
  lixia:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5019dde8-f724-478a-9281-fe96263a3135.jpg",
  xiaoman:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eb3bf755-e5d1-420e-900f-bf34e10ec318.jpg",
  mangzhong:  "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8c27c8f6-dbb0-4b65-8c98-bc3a6f562dca.jpg",
  xiazhi:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d3563bfb-4dcf-4bb1-a34b-157eb2a2b898.jpg",
  xiaoshu:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f2d2016b-eca2-490f-b123-3d71bb180014.jpg",
  dashu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_25259560-5fc9-4dc2-990d-51a09507d857.jpg",
  liqiu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_744aae9c-f098-440d-9258-c9a99ba04a54.jpg",
  chushu:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_aa4b7c29-0d50-4788-9859-c4a7f51027db.jpg",
  bailu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ec62e938-b571-48c8-8ff6-ba9bc1c6ed5a.jpg",
  qiufen:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2fa29fae-4d0d-4f7f-ab33-2a4e07efe3d3.jpg",
  hanlu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5033bb21-7c47-4eb5-af19-da4a7b4a8b25.jpg",
  shuangjiang:"https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_dae03262-b647-4129-b0ec-90a0c462c095.jpg",
  lidong:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c3b930e0-cce6-474f-ab18-6c5ecc5944c0.jpg",
  xiaoxue:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b0f7306e-26f1-49c2-ba2b-73d29b255ba7.jpg",
  daxue:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_486ec38a-e0a1-4fff-af39-a02f10ba1f96.jpg",
  dongzhi:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_bc1be558-5023-484b-bba5-7d9806611abc.jpg",
  xiaohan:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_27e845cb-d737-4dff-bdd9-740328d1d257.jpg",
  dahan:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f442f310-bc26-4062-bdc6-b2a2cb55baf7.jpg",
};

/* 穿衣卡片背景（按季节）*/
const wearBg: Record<string, { bg: string; fg: string }> = {
  春: { bg: "#FFF0F5", fg: "#8c3a5a" },
  夏: { bg: "#F0FFF4", fg: "#1a6e4a" },
  秋: { bg: "#FFF5E0", fg: "#8c5a10" },
  冬: { bg: "#EFF8FF", fg: "#1a3a6e" },
};

export default function CustomsPage() {
  const { lang } = useLanguage();
  const [activeSeason, setActiveSeason] = useState<typeof seasons[number]>("春");
  const filtered = solarTerms.filter(t => t.season === activeSeason);
  const cfg = seasonConfig[activeSeason];
  const wear = wearBg[activeSeason];

  return (
    <div className="pb-24 min-h-screen" style={{ background: "hsl(var(--background))" }}>

      {/* ── 顶部横幅 ── */}
      <div
        className="relative overflow-hidden px-5 pt-7 pb-8 rounded-b-[2rem]"
        style={{ background: cfg.passiveBg }}
      >
        <div className="absolute right-4 top-2 text-4xl opacity-20 pointer-events-none">🎭</div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: cfg.passiveFg }}>{lang === "en" ? "🎭 Traditions" : "🎭 传统习俗"}</h1>
        <p className="font-medium" style={{ fontSize: 15, color: `${cfg.passiveFg}99` }}>{lang === "en" ? "Folk customs of the solar terms across China!" : "节气南北民俗活动，了解中华传统文化！"}</p>
      </div>

      <div className="px-4 pt-4 space-y-5 max-w-2xl mx-auto">

        {/* ── 季节大胶囊 Tab ── */}
        <div className="flex gap-3">
          {seasons.map(s => {
            const c = seasonConfig[s];
            const active = activeSeason === s;
            return (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-full font-bold transition-all btn-child-press"
                style={{
                  height: 52, fontSize: 17,
                  background: active ? c.activeBg : c.passiveBg,
                  color: active ? c.activeFg : c.passiveFg,
                  boxShadow: active ? `0 4px 12px ${c.glowColor}55` : "none",
                  border: active ? "none" : `1.5px solid ${c.glowColor}40`,
                }}
              >
                <span className="text-xl">{c.emoji}</span>
                <span>{lang === "en" ? seasonEn[s] : `${s}季`}</span>
              </button>
            );
          })}
        </div>

        {/* ── 节气卡片列表 ── */}
        {filtered.map(rawTerm => {
          const term = localizeTerm(rawTerm, lang);
          return (
          <div
            key={term.id}
            className="rounded-3xl overflow-hidden border border-border"
            style={{ background: cfg.cardBg, boxShadow: `0 4px 24px ${cfg.glowColor}22` }}
          >
            {/* 大图区 */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={customsImages[term.id] ?? "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80"}
                alt={`${term.name} customs`}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full font-bold text-sm"
                style={{ background: cfg.activeBg, color: cfg.activeFg, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                {lang === "en" ? `${term.season === "春" ? "Spring" : term.season === "夏" ? "Summer" : term.season === "秋" ? "Autumn" : "Winter"} · ${termNameEn(term.id)}` : `${activeSeason}·${term.name}`}
              </div>
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}>
                {term.date}
              </div>
            </div>

            {/* 内容区 */}
            <div className="p-4 space-y-3">
              {/* 做什么 */}
              <div>
                <p className="font-bold mb-1.5" style={{ fontSize: 18, color: cfg.passiveFg }}>{lang === "en" ? "🎪 What to do" : "🎪 节气做什么"}</p>
                <p className="leading-relaxed text-foreground" style={{ fontSize: 17 }}>{term.customs.do}</p>
              </div>

              {/* 南北习俗 */}
              {term.folkCustoms && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-3" style={{ background: "#E8F4FF", border: "1.5px solid #87CEEB55" }}>
                    <p className="font-bold mb-1.5" style={{ fontSize: 15, color: "#1a4a6e" }}>{lang === "en" ? "🧊 In the north" : "🧊 北方习俗"}</p>
                    <p className="leading-relaxed text-foreground" style={{ fontSize: 15 }}>{term.folkCustoms.north.do}</p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ background: "#E8F8EE", border: "1.5px solid #4ECDC455" }}>
                    <p className="font-bold mb-1.5" style={{ fontSize: 15, color: "#1a6e4a" }}>{lang === "en" ? "🌴 In the south" : "🌴 南方习俗"}</p>
                    <p className="leading-relaxed text-foreground" style={{ fontSize: 15 }}>{term.folkCustoms.south.do}</p>
                  </div>
                </div>
              )}

              {/* 穿什么 - 独立卡片 */}
              <div className="rounded-2xl p-4" style={{ background: wear.bg, border: `1.5px solid ${cfg.glowColor}30` }}>
                <p className="font-bold mb-2" style={{ fontSize: 16, color: wear.fg }}>{lang === "en" ? "👕 What to wear" : "👕 穿什么"}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 leading-relaxed text-foreground" style={{ fontSize: 16 }}>
                    {term.customs.wear}
                  </div>
                  <div className="w-10 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
                    <img src={MASCOT_IMG} alt="Sisi outfit" className="w-full h-full object-cover object-top"
                      style={{ mixBlendMode: "multiply" }} />
                  </div>
                </div>
              </div>

              {/* 小朋友说 + 四四 */}
              {term.folkCustoms && (
                <div className="rounded-2xl p-4" style={{ background: "#FFF9E6", border: "1.5px solid #FFD93D55" }}>
                  <p className="font-bold mb-2" style={{ fontSize: 16, color: "#8c6400" }}>{lang === "en" ? "👶 Kids say:" : "👶 小朋友说："}</p>
                  <p className="leading-relaxed text-foreground mb-3" style={{ fontSize: 16 }}>
                    {term.folkCustoms.kidsExplain}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
                      <img src={MASCOT_IMG} alt="四四" className="w-full h-full object-cover object-top"
                        style={{ mixBlendMode: "multiply" }} />
                    </div>
                    <div className="flex-1 rounded-2xl px-3 py-2 text-sm font-medium"
                      style={{ background: "#FFF3C4", color: "#8c6400", borderRadius: 16, borderTopLeftRadius: 4 }}>
                      {lang === "en" ? `Wow, ${term.season === "春" ? "spring" : term.season === "夏" ? "summer" : term.season === "秋" ? "autumn" : "winter"} customs are so fun — Sisi wants to join in! 🦌` : `哇！${activeSeason}天的习俗好有趣，四四也要参与！🦌`}
                    </div>
                  </div>
                </div>
              )}

              {/* 大 CTA 按钮 */}
              <Link to={`/solar-term/${term.id}`}>
                <button
                  className="w-full rounded-2xl font-bold btn-child-press transition-all mt-1"
                  style={{
                    height: 60, fontSize: 18,
                    background: cfg.activeBg, color: cfg.activeFg,
                    boxShadow: `0 4px 12px ${cfg.glowColor}44`,
                  }}
                >
                  {lang === "en" ? `🔍 See ${termNameEn(term.id)} details` : `🔍 查看${term.name}节气详情`}
                </button>
              </Link>
            </div>
          </div>
          );
        })}

      </div>
    </div>
  );
}
