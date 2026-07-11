import { Link } from "react-router-dom";
import { getTermsBySeason } from "@/data/solarTerms";
import { cn } from "@/lib/utils";

/* ── 季节配置（马卡龙色板）── */
const seasons = [
  {
    name: "春" as const, char: "春", pinyin: "chūn",
    labelColor: "text-[#1E5C35]", dotColor: "bg-[#5BA883]",
    hoverBorder: "hover:border-[#5BA883]/50",
    activeBg:    "bg-[#EAF7EE]",
    headerBg:    "bg-gradient-to-r from-[#EAF7EE] to-[#D5F0E0]",
    tagBg:       "bg-[#C8EDD6] text-[#1E5C35]",
    fallbackBg:  "from-[#EAF7EE] to-[#C8EDD6]",
    fallbackText:"text-[#1E5C35]",
    fallbackChar:"🌱",
  },
  {
    name: "夏" as const, char: "夏", pinyin: "xià",
    labelColor: "text-[#1A4D45]", dotColor: "bg-[#4ECDC4]",
    hoverBorder: "hover:border-[#4ECDC4]/50",
    activeBg:    "bg-[#D8F2ED]",
    headerBg:    "bg-gradient-to-r from-[#D8F2ED] to-[#C0EDE7]",
    tagBg:       "bg-[#B8EDE8] text-[#1A4D45]",
    fallbackBg:  "from-[#D8F2ED] to-[#B8EDE8]",
    fallbackText:"text-[#1A4D45]",
    fallbackChar:"🌿",
  },
  {
    name: "秋" as const, char: "秋", pinyin: "qiū",
    labelColor: "text-[#5C3A10]", dotColor: "bg-[#E8A87C]",
    hoverBorder: "hover:border-[#E8A87C]/50",
    activeBg:    "bg-[#FEF3DF]",
    headerBg:    "bg-gradient-to-r from-[#FEF3DF] to-[#FAE9C8]",
    tagBg:       "bg-[#F5DFB0] text-[#5C3A10]",
    fallbackBg:  "from-[#FEF3DF] to-[#F5DFB0]",
    fallbackText:"text-[#5C3A10]",
    fallbackChar:"🍂",
  },
  {
    name: "冬" as const, char: "冬", pinyin: "dōng",
    labelColor: "text-[#1A3A5C]", dotColor: "bg-[#6BA3D6]",
    hoverBorder: "hover:border-[#6BA3D6]/50",
    activeBg:    "bg-[#E3EFF9]",
    headerBg:    "bg-gradient-to-r from-[#E3EFF9] to-[#CCE0F5]",
    tagBg:       "bg-[#C0D8F0] text-[#1A3A5C]",
    fallbackBg:  "from-[#E3EFF9] to-[#C0D8F0]",
    fallbackText:"text-[#1A3A5C]",
    fallbackChar:"❄️",
  },
];

export default function SeasonGrid() {
  return (
    <div className="space-y-10">
      {seasons.map((season) => {
        const terms = getTermsBySeason(season.name);
        return (
          <section key={season.name}>
            {/* 季节标题行（大字号，文档4.2 卡片标题24-28px）*/}
            <div className="flex items-center gap-4 mb-5">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-border",
                season.activeBg
              )}>
                <span className={cn("text-2xl font-bold font-serif", season.labelColor)}>
                  {season.char}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={cn("font-bold font-serif tracking-wide", season.labelColor)} style={{ fontSize: 24 }}>
                    {season.char}季
                  </span>
                  <span className="text-sm text-muted-foreground tracking-widest italic">{season.pinyin}</span>
                </div>
                {/* 装饰分隔线 */}
                <div className={cn("h-1 w-16 rounded-full mt-1", season.dotColor)} style={{ opacity: 0.5 }} />
              </div>
              <span className="text-sm text-muted-foreground shrink-0">{terms.length} 个节气</span>
            </div>

            {/* 节气卡片网格（每行2个手机/3个平板）*/}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {terms.map((term) => (
                <Link key={term.id} to={`/solar-term/${term.id}`} className="h-full">
                  <div className={cn(
                    "group h-full bg-card border-2 border-border rounded-3xl overflow-hidden",
                    "flex flex-col transition-all duration-250 btn-child-press",
                    "hover:-translate-y-1.5",
                    season.hoverBorder
                  )}
                  style={{ boxShadow: "var(--shadow-card)" }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
                  >
                    {/* 图片区（文档8.2 4:3比例）*/}
                    <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                      {term.imageUrl ? (
                        <img
                          src={term.imageUrl}
                          alt={`${term.name}节气插画`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br", season.fallbackBg)}>
                          <span className={cn("text-5xl", season.fallbackText)}>{season.fallbackChar}</span>
                        </div>
                      )}
                      {/* 渐变遮罩 */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card/90 to-transparent" />
                    </div>

                    {/* 文字区（节气名24px，描述16px）*/}
                    <div className="flex flex-col flex-1 px-3.5 pt-3 pb-4">
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <h3 className="font-bold text-foreground text-balance leading-tight" style={{ fontSize: 22 }}>
                          {term.name}
                        </h3>
                        <span className={cn("text-xs font-semibold shrink-0 px-2 py-1 rounded-full mt-0.5", season.tagBg)}>
                          {term.month}/{term.day}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed line-clamp-2 text-pretty flex-1" style={{ fontSize: 15 }}>
                        {term.climate}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

