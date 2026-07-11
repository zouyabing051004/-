import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { solarTerms } from "@/data/solarTerms";

const MASCOT_IMG = "https://miaoda-conversation-file.cdn.bcebos.com/user-bp1ypf4gx3i8/app-c2zk70llophd/20260614/%E5%90%89%E7%A5%A5%E7%89%A9.png";

const seasonConfig = {
  春: { emoji: "🌱", activeBg: "#5BA883", activeFg: "#fff", passiveBg: "#EAF7EE", passiveFg: "#1E5C35", cardBg: "#FFF9F0", glowColor: "#5BA883" },
  夏: { emoji: "🌿", activeBg: "#4ECDC4", activeFg: "#fff", passiveBg: "#D8F2ED", passiveFg: "#1A4D45", cardBg: "#EAF9F7", glowColor: "#4ECDC4" },
  秋: { emoji: "🍂", activeBg: "#E8A87C", activeFg: "#fff", passiveBg: "#FEF3DF", passiveFg: "#5C3A10", cardBg: "#FFF8F0", glowColor: "#E8A87C" },
  冬: { emoji: "❄️", activeBg: "#6BA3D6", activeFg: "#fff", passiveBg: "#E3EFF9", passiveFg: "#1A3A5C", cardBg: "#EEF6FF", glowColor: "#6BA3D6" },
} as const;

const seasons = ["春", "夏", "秋", "冬"] as const;

const foodImages: Record<string, string> = {
  lichun:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cbcc945a-98fb-4d27-b8f5-3c93ad80a5ac.jpg",
  yushui:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_99ec2123-7eda-46e3-96c5-bb2180c04269.jpg",
  jingzhe:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_60efeac7-c280-4ea2-93e1-b2b6f18696fa.jpg",
  chunfen:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_334fc5f9-1dd5-437f-b7dd-deb032c735ce.jpg",
  qingming:   "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_77105f14-f63f-4222-80ec-286357a5430f.jpg",
  guyu:       "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_49d07910-3eb0-4b5e-b19e-a1358304319c.jpg",
  lixia:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_df4954fb-ca8e-4e99-839a-91703dfa52f3.jpg",
  xiaoman:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8c896ad8-2ef9-4e47-b5c9-a73c9108bca7.jpg",
  mangzhong:  "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7df45bc7-ab98-4faa-a484-55c3fdcb6a87.jpg",
  xiazhi:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_64925658-43d9-416a-ada6-281f5833b949.jpg",
  xiaoshu:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_149b5a13-0ff1-4d2f-94fd-7a9c9f676d20.jpg",
  dashu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_13ce1247-eef6-49af-93a2-b52c8203c90a.jpg",
  liqiu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cbf82e2b-e026-42a5-9858-772f2599c134.jpg",
  chushu:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_dda91c43-67d1-45f9-bcdd-674fb4eac617.jpg",
  bailu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b39f2ce9-96f6-4233-b85e-dc72157f12b2.jpg",
  qiufen:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5eb46b3e-d1e7-46ec-bee3-6b9a4d944e36.jpg",
  hanlu:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_bdae8682-c55d-4a64-8f20-2ad50340fa56.jpg",
  shuangjiang:"https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_87630709-bb42-42d4-b940-2691b315a3e6.jpg",
  lidong:     "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_89ed17c6-3256-4535-86df-3fd9b5bda4ee.jpg",
  xiaoxue:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_feeab0eb-47af-408d-9313-f90d23567d13.jpg",
  daxue:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c888e411-ebc2-4998-825d-8820b85ef55e.jpg",
  dongzhi:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_88be4dd9-dcd2-4e34-9590-0fa1d5667914.jpg",
  xiaohan:    "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d5fe0807-21c8-4942-a28c-740b5974b87d.jpg",
  dahan:      "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_95d8d203-c686-4c16-82bc-c5f9f208ab83.jpg",
};

export default function FolkFoodPage() {
  const { lang } = useLanguage();
  const [activeSeason, setActiveSeason] = useState<typeof seasons[number]>("春");
  const filtered = solarTerms.filter(t => t.season === activeSeason);
  const cfg = seasonConfig[activeSeason];

  return (
    <div className="pb-24 min-h-screen" style={{ background: "hsl(var(--background))" }}>

      {/* ── 顶部横幅 ── */}
      <div
        className="relative overflow-hidden px-5 pt-7 pb-8 rounded-b-[2rem]"
        style={{ background: cfg.passiveBg }}
      >
        <div className="absolute right-4 top-2 text-4xl opacity-20 pointer-events-none">🍜</div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: cfg.passiveFg }}>{lang === "en" ? "🍜 Festive Foods" : "🍜 民俗饮食"}</h1>
        <p className="font-medium" style={{ fontSize: 15, color: `${cfg.passiveFg}99` }}>{lang === "en" ? "Tasty seasonal foods from north and south China!" : "二十四节气南北方特色美食，美味又有趣！"}</p>
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
                  height: 52,
                  fontSize: 17,
                  background: active ? c.activeBg : c.passiveBg,
                  color: active ? c.activeFg : c.passiveFg,
                  boxShadow: active ? `0 4px 12px ${c.glowColor}55` : "none",
                  border: active ? "none" : `1.5px solid ${c.glowColor}40`,
                }}
              >
                <span className="text-xl">{c.emoji}</span>
                <span>{s}季</span>
              </button>
            );
          })}
        </div>

        {/* ── 节气卡片列表 ── */}
        {filtered.map(term => (
          <div
            key={term.id}
            className="rounded-3xl overflow-hidden border border-border"
            style={{ background: cfg.cardBg, boxShadow: `0 4px 24px ${cfg.glowColor}22` }}
          >
            {/* 大图区（独立，文字不重叠）*/}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={foodImages[term.id] ?? "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80"}
                alt={`${term.name}特色食物`}
                className="w-full h-full object-cover"
              />
              {/* 季节·节气标签 - 左上 */}
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full font-bold text-sm"
                style={{ background: cfg.activeBg, color: cfg.activeFg, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
              >
                {activeSeason}·{term.name}
              </div>
              {/* 日期 - 右上 */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ background: "rgba(0,0,0,0.45)", color: "#fff" }}>
                {term.date}
              </div>
            </div>

            {/* 内容区（图片下方独立）*/}
            <div className="p-4 space-y-3">
              {/* 吃什么 - 大标题 */}
              <div>
                <p className="font-bold mb-1.5" style={{ fontSize: 18, color: cfg.passiveFg }}>🍽️ 节气吃什么</p>
                <p className="leading-relaxed text-foreground" style={{ fontSize: 17 }}>{term.customs.eat}</p>
              </div>

              {/* 南北差异 - 大卡片并排 */}
              {term.folkCustoms && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-3" style={{ background: "#E8F4FF", border: "1.5px solid #87CEEB55" }}>
                    <p className="font-bold mb-1.5" style={{ fontSize: 15, color: "#1a4a6e" }}>🧊 北方吃</p>
                    <p className="leading-relaxed text-foreground" style={{ fontSize: 15 }}>{term.folkCustoms.north.eat}</p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ background: "#E8F8EE", border: "1.5px solid #4ECDC455" }}>
                    <p className="font-bold mb-1.5" style={{ fontSize: 15, color: "#1a6e4a" }}>🌴 南方吃</p>
                    <p className="leading-relaxed text-foreground" style={{ fontSize: 15 }}>{term.folkCustoms.south.eat}</p>
                  </div>
                </div>
              )}

              {/* 小朋友说 - 独立大卡片 + 四四 */}
              {term.folkCustoms && (
                <div className="rounded-2xl p-4" style={{ background: "#FFF9E6", border: "1.5px solid #FFD93D55" }}>
                  <p className="font-bold mb-2" style={{ fontSize: 16, color: "#8c6400" }}>👶 小朋友说：</p>
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
                      我也想吃！四四最喜欢{activeSeason}天的美食了～🦌
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
                  🔍 看看更多关于{term.name}的内容
                </button>
              </Link>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
