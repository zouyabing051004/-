import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { termNameEn } from "@/data/solarTermsEn";
import { useEffect } from "react";
import { ArrowLeft, Sprout } from "lucide-react";
import { getTermById } from "@/data/solarTerms";
import PoetryReader from "@/components/PoetryReader";
import MindMapSection from "@/components/MindMapSection";
import { useAchievement } from "@/contexts/AchievementContext";

// 物候关键词 → 实景图片映射
const phenologyImageMap: Record<string, string> = {
  "东风": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_023c5e92-519b-4c1c-b05d-a5f10c69e928.jpg",
  "解冻": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_023c5e92-519b-4c1c-b05d-a5f10c69e928.jpg",
  "冻": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_023c5e92-519b-4c1c-b05d-a5f10c69e928.jpg",
  "蛰虫": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d761e599-a4c4-43c7-a9af-25ee8f86aec5.jpg",
  "虫": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d761e599-a4c4-43c7-a9af-25ee8f86aec5.jpg",
  "蚯蚓": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d761e599-a4c4-43c7-a9af-25ee8f86aec5.jpg",
  "鱼": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_44f6422d-1792-4e8b-bc61-2fb5dc30d57e.jpg",
  "桃": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3289ce32-7d69-47d3-bc15-3eaa1fa16197.jpg",
  "燕": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3289ce32-7d69-47d3-bc15-3eaa1fa16197.jpg",
  "莺": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_78dbde11-8f9b-4d19-aa12-d78e1d1ce0ad.jpg",
  "布谷": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_78dbde11-8f9b-4d19-aa12-d78e1d1ce0ad.jpg",
  "鸣": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_78dbde11-8f9b-4d19-aa12-d78e1d1ce0ad.jpg",
  "荷": "https://miaoda-image.cdn.bcebos.com/img/corpus/989a4f71528e4c95aa6f467e2eb92ab3.jpg",
  "莲": "https://miaoda-image.cdn.bcebos.com/img/corpus/989a4f71528e4c95aa6f467e2eb92ab3.jpg",
  "雷": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_328506fb-37f8-4654-b1f6-ea1222ea5076.jpg",
  "蟋蟀": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_38672c08-c4f2-4990-a1c9-7af827c0320e.jpg",
  "鸿雁": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_03200612-4f05-4ae5-8763-15c2ce752001.jpg",
  "雁": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_03200612-4f05-4ae5-8763-15c2ce752001.jpg",
  "枫": "https://miaoda-image.cdn.bcebos.com/img/corpus/d5577ae3a4d248a79879067caa736a7f.jpg",
  "菊": "https://miaoda-image.cdn.bcebos.com/img/corpus/d5577ae3a4d248a79879067caa736a7f.jpg",
  "叶落": "https://miaoda-image.cdn.bcebos.com/img/corpus/d5577ae3a4d248a79879067caa736a7f.jpg",
  "雪": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d695d03d-be24-4cff-83c2-e6524cd0db21.jpg",
  "梅": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_93f4f0c9-4c61-40e3-aae2-349d7a869cad.jpg",
  "冰": "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_023c5e92-519b-4c1c-b05d-a5f10c69e928.jpg",
};

// 按候原文关键词匹配图片
function getPhenologyImage(raw: string): string | null {
  for (const [kw, url] of Object.entries(phenologyImageMap)) {
    if (raw.includes(kw)) return url;
  }
  return null;
}

// 季节对应配色（马卡龙色系）
const seasonStyle: Record<string, { heroBg: string; badgeBg: string; badgeFg: string; img: string; accent: string }> = {
  春: {
    heroBg: "#EAF7EE",
    badgeBg: "#C8EDD6", badgeFg: "#1E5C35",
    accent: "bg-[#EAF7EE] text-[#1E5C35] border-[#C8EDD6]",
    img: "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0da793f0-7b00-43b6-9dc8-5448760c5703.jpg",
  },
  夏: {
    heroBg: "#D8F2ED",
    badgeBg: "#B8EDE8", badgeFg: "#1A4D45",
    accent: "bg-[#D8F2ED] text-[#1A4D45] border-[#B8EDE8]",
    img: "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_899537c1-18ad-4985-84bb-f225f88872dc.jpg",
  },
  秋: {
    heroBg: "#FEF3DF",
    badgeBg: "#F5DFB0", badgeFg: "#5C3A10",
    accent: "bg-[#FEF3DF] text-[#5C3A10] border-[#F5DFB0]",
    img: "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_24be2079-2c91-4b9c-9c91-ebc06099ed21.jpg",
  },
  冬: {
    heroBg: "#E3EFF9",
    badgeBg: "#C0D8F0", badgeFg: "#1A3A5C",
    accent: "bg-[#E3EFF9] text-[#1A3A5C] border-[#C0D8F0]",
    img: "https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7737a5fc-aeff-4e7d-a171-fb3ff7dbbffc.jpg",
  },
};

type AgeMode = "young";

export default function SolarTermDetailPage() {
  const { lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const term = getTermById(id || "");
  const ageMode: AgeMode = "young";
  const { recordLearn } = useAchievement();

  /* 每次进入节气详情页，自动记录学习并触发成就 */
  useEffect(() => {
    if (id) recordLearn(id);
  }, [id, recordLearn]);

  if (!term) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">未找到该节气信息</p>
        <Link to="/" className="inline-flex items-center justify-center mt-4 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors">返回首页</Link>
      </div>
    );
  }

  const style = seasonStyle[term.season] ?? seasonStyle["春"];

  return (
    <div className="pb-16">
      {/* ── Banner：马卡龙色背景 + 节气大字 ── */}
      <div
        className="relative overflow-hidden px-5 pt-7 pb-10 rounded-b-[2rem]"
        style={{ background: style.heroBg }}
      >
        {/* 装饰图片：右侧淡化 */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-30 pointer-events-none">
          <img src={style.img} alt="" className="w-full h-full object-cover object-left" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/80" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link to="/">
              <button
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-all btn-child-press"
                style={{ background: "rgba(255,255,255,0.7)", color: style.badgeFg, border: `1px solid ${style.badgeBg}` }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />返回
              </button>
            </Link>
          </div>
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 border"
            style={{ background: style.badgeBg, color: style.badgeFg, borderColor: style.badgeBg }}
          >
            {term.season}季
          </span>
          <h1
            className="font-bold leading-none"
            style={{ fontSize: "clamp(52px, 12vw, 80px)", color: style.badgeFg }}
          >
            {term.name}{lang === "en" && term.id ? ` · ${termNameEn(term.id)}` : ""}
          </h1>
          <p className="mt-2 text-sm font-medium" style={{ color: `${style.badgeFg}aa` }}>{term.date}</p>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

        {/* ── 气候简介 ── */}
        <div
          className="rounded-[1.5rem] p-5"
          style={{ background: "#FFF9F0", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
        >
          <p className="text-foreground leading-relaxed text-base md:text-lg text-pretty">{term.climate}</p>
        </div>

        {/* ── 三候儿童解说 ── */}
        {term.phenologyKids && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground text-lg">节气三候</h2>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: style.badgeBg, color: style.badgeFg }}
              >物候现象</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {term.phenologyKids.map((p, i) => {
                const img = getPhenologyImage(p.raw);
                return (
                  <div
                    key={i}
                    className="rounded-[1.5rem] overflow-hidden"
                    style={{ background: "#FFF9F0", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex items-center gap-2.5 px-5 pt-5 pb-2">
                      <span
                        className="w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center shrink-0"
                        style={{ background: style.badgeBg, color: style.badgeFg }}
                      >{i + 1}</span>
                      <span className="text-sm font-bold text-primary">{p.raw}</span>
                    </div>
                    <p className="px-5 pb-4 text-base leading-relaxed text-foreground text-pretty">{p.kids}</p>
                    {img && (
                      <div className="w-full aspect-[4/3] overflow-hidden">
                        <img src={img} alt={p.raw} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 思维导图：民俗饮食 / 穿什么 / 节气由来 ── */}
        <div
          className="rounded-[1.5rem] p-5 md:p-6"
          style={{ background: "#FFF9F0", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
        >
          <MindMapSection term={term} ageMode={ageMode} />
        </div>

        {/* ── 古诗词 + 注解 + 朗读 ── */}
        <div
          className="rounded-[1.5rem] overflow-hidden p-5 md:p-6"
          style={{ background: "#FFF9F0", border: "1.5px solid rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
        >
            <div className="flex items-start gap-4">
              <div className="w-1.5 bg-primary rounded-full self-stretch shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-xl font-serif text-balance">{term.poem.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 mt-0.5">—— {term.poem.author}</p>
                <p className="text-primary text-2xl leading-loose font-serif italic whitespace-pre-line">{term.poem.content}</p>

                {/* 朗读提示 */}
                {term.poem.readingTip && (
                  <div className="mt-3 rounded-2xl p-4" style={{ background: "#D8F2ED" }}>
                    <p className="text-sm font-bold mb-1" style={{ color: "#1A4D45" }}>🎤 朗读小提示</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#1A4D45cc" }}>{term.poem.readingTip}</p>
                  </div>
                )}

                <div className="mt-4">
                  <PoetryReader text={term.poem.content} title={term.poem.title} />
                </div>
              </div>
            </div>
          </div>

        {/* ── 关键词标签 ── */}
        <div className="flex flex-wrap gap-2 pb-2">
          {term.keywords.map(kw => (
            <span
              key={kw}
              className="text-sm px-4 py-1.5 rounded-full font-medium"
              style={{ background: style.badgeBg, color: style.badgeFg }}
            >{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
