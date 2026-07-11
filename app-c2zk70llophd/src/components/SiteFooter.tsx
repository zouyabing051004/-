import { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";
import { supabase } from "@/db/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

// 今日访客标记 key
const VISITOR_KEY = "siteVisitorDate";

function formatNumber(n: number, lang: string): string {
  return n.toLocaleString(lang === "en" ? "en-US" : "zh-CN");
}

export default function SiteFooter() {
  const { lang } = useLanguage();
  const [visitors, setVisitors] = useState<number>(0);
  const [pageviews, setPageviews] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const isNewVisitor = localStorage.getItem(VISITOR_KEY) !== today;

        // 先记录浏览量
        const { data: pvData } = await supabase.rpc("record_pageview");

        let visitorCount = pvData?.visitor_count ?? 0;
        let pageviewCount = pvData?.pageview_count ?? 0;

        // 若今天首次访问，再记录新访客
        if (isNewVisitor) {
          localStorage.setItem(VISITOR_KEY, today);
          const { data: vData } = await supabase.rpc("record_new_visitor");
          visitorCount = vData?.visitor_count ?? visitorCount;
          pageviewCount = vData?.pageview_count ?? pageviewCount;
        }

        if (!cancelled) {
          setVisitors(visitorCount);
          setPageviews(pageviewCount);
          setLoaded(true);
        }
      } catch (e) {
        console.error("站点统计加载失败:", e);
        if (!cancelled) setLoaded(true);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm pb-[env(safe-area-inset-bottom,0px)]">
      {/* 访客统计条 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 py-3 px-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border/50">
        {/* 头像堆叠装饰 */}
        <div className="flex items-center -space-x-2 shrink-0">
          {["🐣","🐥","🦊","🐼","🐨","🐸","🦋"].map((emoji, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-sm"
              style={{ zIndex: 7 - i }}
            >
              {emoji}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-bold text-primary" style={{ zIndex: 0 }}>
            +
          </div>
        </div>

        {/* 统计文字 */}
        <p className="text-sm text-foreground font-medium text-center text-pretty">
          {lang === "en" ? (
            <>
              <span className="text-primary font-bold text-base">
                {loaded ? formatNumber(visitors, lang) : "—"}
              </span>{" "}
              friends are learning with you today, with{" "}
              <span className="text-primary font-bold text-base">
                {loaded ? formatNumber(pageviews, lang) : "—"}
              </span>{" "}
              page visits so far
            </>
          ) : (
            <>
              今天已有{" "}
              <span className="text-primary font-bold text-base">
                {loaded ? formatNumber(visitors, lang) : "—"}
              </span>{" "}
              人与你一起学习，你们共浏览了{" "}
              <span className="text-primary font-bold text-base">
                {loaded ? formatNumber(pageviews, lang) : "—"}
              </span>{" "}
              次
            </>
          )}
        </p>

        {/* 小图标 */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            {lang === "en" ? "Visitors today" : "今日访客"}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-primary" />
            {lang === "en" ? "Total views" : "总浏览量"}
          </span>
        </div>
      </div>

      {/* 底部版权 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 py-2.5 px-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {lang === "en" ? "Hejian Shisui · A 24-Solar-Terms Learning Site for Kids" : "禾间识岁 · 二十四节气儿童学习平台"}</span>
        <span className="hidden sm:block text-border">|</span>
        <span>{lang === "en" ? "Discover the solar terms with Sisi, your AI culture buddy 🌿" : "探索节气奥秘，AI伴游童趣传统文化 🌿"}</span>
      </div>
    </footer>
  );
}
