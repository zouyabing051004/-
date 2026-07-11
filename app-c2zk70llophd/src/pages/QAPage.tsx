import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Lightbulb, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AIChat from "@/components/AIChat";

const suggestedQuestions = [
  "立春是什么时候？",
  "冬至为什么要吃饺子？",
  "清明节的由来是什么？",
  "夏天有哪些节气？",
  "为什么叫惊蛰？",
  "大雪节气会下雪吗？",
];

export default function QAPage() {
  const { lang } = useLanguage();
  const [selectedQ, setSelectedQ] = useState<string | null>(null);

  return (
    <div className="pb-10">
      {/* 页面插画 Banner */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 180 }}>
        <img
          src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f925e532-aa7a-4e96-be3a-923432435a52.jpg"
          alt="节气问答插画"
          className="w-full object-cover"
          style={{ maxHeight: 220 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-background/90" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-2xl font-bold text-white drop-shadow font-serif flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            {lang === "en" ? "Ask About Solar Terms" : "节气问答"}
          </h1>
          <p className="text-white/80 text-sm mt-1">{lang === "en" ? "Explore the 24 solar terms with Sisi" : "和四四一起探索二十四节气的奥秘"}</p>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：推荐问题 */}
          <div className="space-y-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  推荐问题
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {suggestedQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 px-3 text-left"
                    onClick={() => setSelectedQ(q)}
                  >
                    <Sparkles className="w-3 h-3 mr-2 text-primary shrink-0" />
                    <span className="text-foreground">{q}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-accent/50 border-border overflow-hidden">
              <img
                src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1706b741-6dd8-4428-8fd9-8714baf69898.jpg"
                alt="节气插画"
                className="w-full object-cover"
                style={{ height: 120 }}
              />
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">学习小贴士</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>可以问节气的时间、气候</li>
                  <li>可以问节气的习俗和故事</li>
                  <li>可以问节气相关的诗词</li>
                  <li>可以问自然现象的原因</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：AI对话 */}
          <div className="lg:col-span-2 h-[500px]">
            <AIChat initialMessage={selectedQ ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
