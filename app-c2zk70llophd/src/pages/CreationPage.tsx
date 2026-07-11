import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PenTool, BookOpen, Feather, Loader2, RefreshCw,
  Sparkles, Volume2, VolumeX, Image as ImageIcon, Film, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { solarTerms } from "@/data/solarTerms";
import {
  generatePoem, generateStory, generateSpeech,
  generateIllustration, submitImageToVideo, queryVideoTask
} from "@/services/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CreationType = "poem" | "story";

// 创作结果卡片：文字 + 配图 + 语音 + 视频
function CreationResult({
  type,
  selectedTerm,
  result,
  onReset,
}: {
  type: CreationType;
  selectedTerm: string;
  result: string;
  onReset: () => void;
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoStatus, setVideoStatus] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 语音朗读（小奶音）
  const handleSpeak = async () => {
    if (isSpeaking) {
      audioRef.current?.pause();
      setIsSpeaking(false);
      return;
    }
    setAudioLoading(true);
    try {
      const url = await generateSpeech(result);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = url;
      audioRef.current.onended = () => setIsSpeaking(false);
      audioRef.current.onerror = () => { setIsSpeaking(false); toast.error("音频播放失败"); };
      await audioRef.current.play();
      setIsSpeaking(true);
    } catch (err) {
      toast.error("语音合成失败，请重试");
    } finally {
      setAudioLoading(false);
    }
  };

  // 生成配图
  const handleGenerateImage = async () => {
    setImageLoading(true);
    setImageUrl(null);
    try {
      const imgPrompt = type === "poem"
        ? `${selectedTerm}节气，${result.slice(0, 30)}，儿童绘本插画`
        : `${selectedTerm}节气故事场景，小动物主角，儿童绘本插画`;
      const url = await generateIllustration(imgPrompt);
      setImageUrl(url);
    } catch (err) {
      toast.error("配图生成失败，请重试");
    } finally {
      setImageLoading(false);
    }
  };

  // 图片生成视频（需要先有配图）
  const handleGenerateVideo = async () => {
    if (!imageUrl) {
      toast.warning("请先生成配图，再制作动画视频");
      return;
    }
    setVideoLoading(true);
    setVideoUrl(null);
    setVideoStatus("提交中...");
    try {
      const prompt = `${selectedTerm}节气，温柔的微风轻轻吹过，画面缓缓流动，儿童绘本风格`;
      const taskId = await submitImageToVideo(imageUrl, prompt);

      // 轮询任务状态（最多5分钟）
      const maxAttempts = 40;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, 7000));
        setVideoStatus(`生成中... (${i + 1}/${maxAttempts})`);
        const res = await queryVideoTask(taskId);
        if (res.status === "succeed" && res.videoUrl) {
          setVideoUrl(res.videoUrl);
          setVideoStatus("完成");
          toast.success("动画视频已生成！");
          break;
        }
        if (res.status === "failed") {
          throw new Error("视频生成失败");
        }
      }
    } catch (err) {
      toast.error((err as Error).message || "视频生成失败");
      setVideoStatus("失败");
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 文字结果 */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {type === "poem" ? "🌸 我的小诗" : "📖 我的故事"}
            </span>
            <span className="text-xs text-muted-foreground">关于{selectedTerm}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
            <RefreshCw className="w-3 h-3 mr-1" />
            重新创作
          </Button>
        </div>
        <p className="text-foreground leading-loose whitespace-pre-wrap font-serif text-base text-pretty">
          {result}
        </p>

        {/* 操作按钮行 */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
          {/* 语音朗读 */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleSpeak}
            disabled={audioLoading}
          >
            {audioLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSpeaking ? (
              <VolumeX className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            {audioLoading ? "合成中..." : isSpeaking ? "停止朗读" : "🎵 小奶音朗读"}
          </Button>

          {/* 生成配图 */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleGenerateImage}
            disabled={imageLoading}
          >
            {imageLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : imageUrl ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            {imageLoading ? "绘图中..." : imageUrl ? "重新配图" : "🎨 生成配图"}
          </Button>

          {/* 制作动画 */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={handleGenerateVideo}
            disabled={videoLoading || !imageUrl}
          >
            {videoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : videoUrl ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Film className="w-3.5 h-3.5" />
            )}
            {videoLoading ? videoStatus : videoUrl ? "重新动画" : "🎬 制作动画"}
          </Button>
        </div>
      </div>

      {/* 配图区域 */}
      {(imageLoading || imageUrl) && (
        <div className="rounded-2xl overflow-hidden border border-border bg-muted/30">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">专属配图</span>
          </div>
          {imageLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI正在为你绘制专属插画...</p>
              <p className="text-xs text-muted-foreground">中国传统儿童绘本风格</p>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="AI生成配图"
              className="w-full object-contain max-h-80"
            />
          ) : null}
        </div>
      )}

      {/* 视频区域 */}
      {(videoLoading || videoUrl) && (
        <div className="rounded-2xl overflow-hidden border border-border bg-muted/30">
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">动画视频</span>
          </div>
          {videoLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{videoStatus}</p>
              <p className="text-xs text-muted-foreground">让插画动起来，约需1-3分钟</p>
            </div>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="w-full max-h-80 object-contain bg-black"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

// 引导提示（幼小衔接风格）
const GUIDED_PROMPTS: Record<CreationType, Record<string, string[]>> = {
  poem: {
    default: ["天气变了，什么感觉？", "看到了什么特别的东西？", "有什么让你很开心？"],
  },
  story: {
    default: ["小动物在干什么？", "发生了什么有趣的事？", "你想带谁去看看节气？"],
  },
};

export default function CreationPage() {
  const { lang } = useLanguage();
  const [type, setType] = useState<CreationType>("poem");
  const [selectedTerm, setSelectedTerm] = useState(solarTerms[0].name);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const prompts = GUIDED_PROMPTS[type].default;

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("请先写下你对这个节气的感受哦！");
      return;
    }
    setIsLoading(true);
    setResult("");
    try {
      const content =
        type === "poem"
          ? await generatePoem(selectedTerm, input)
          : await generateStory(selectedTerm, input);
      setResult(content);
    } catch (err) {
      console.error("创作失败:", err);
      toast.error("创作失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-10">
      {/* 页面 Banner */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 140 }}>
        <img
          src="https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b657e594-8e74-4d2b-9d9b-973a146055bf.jpg"
          alt="创作插画"
          className="w-full object-cover"
          style={{ maxHeight: 180 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-background/90" />
        <div className="absolute bottom-0 left-0 p-5">
          <h1 className="text-xl font-bold text-white drop-shadow font-serif flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            {lang === "en" ? "Guided Creation" : "引导式创作"}
          </h1>
          <p className="text-white/80 text-xs mt-0.5">
            {lang === "en" ? "Write poems · Tell stories · Add pictures · Hear them read aloud" : "写小诗 · 编故事 · 图文并茂 · 小奶音朗读"}
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── 左侧：创作设置 ── */}
          <div className="space-y-4">

            {/* 创作类型 */}
            <div className="grid grid-cols-2 gap-2">
              {(["poem", "story"] as CreationType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border transition-all",
                    type === t
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:bg-accent"
                  )}
                >
                  {t === "poem" ? (
                    <><Feather className="w-4 h-4" />写小诗</>
                  ) : (
                    <><BookOpen className="w-4 h-4" />编故事</>
                  )}
                </button>
              ))}
            </div>

            {/* 幼小衔接说明 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
              <p className="font-semibold mb-1">✨ 幼小衔接模式</p>
              <p className="text-pretty">
                {type === "poem"
                  ? "参考国家教育标准，生成朗朗上口、押韵易背的节气儿歌，适合幼儿园大班和小学低年级"
                  : "遵循幼小衔接叙事结构：发现→解决→收获，培养逻辑思维，结尾附学习小启发"}
              </p>
            </div>

            {/* 节气选择 */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm">选择节气 🌿</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="选择一个节气" />
                  </SelectTrigger>
                  <SelectContent>
                    {solarTerms.map((term) => (
                      <SelectItem key={term.id} value={term.name}>
                        {term.name}（{term.season}季 · {term.date}）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* 输入感受 */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-sm">写下你的想法 💬</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4 space-y-3">
                {/* 引导提示按钮 */}
                <div className="flex flex-wrap gap-1.5">
                  {prompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => setInput((prev) => (prev ? prev + "，" + p : p))}
                      className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    type === "poem"
                      ? `${selectedTerm}让你想到了什么？比如：天气变暖了，燕子飞回来了...`
                      : `${selectedTerm}发生了什么有趣的事？比如：小兔子看到下雪了...`
                  }
                  className="min-h-[100px] text-sm resize-none"
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !input.trim()}
                  className="w-full h-10"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />AI正在创作中...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />开始创作 ✨</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ── 右侧：图文并茂结果 ── */}
          <div>
            {result ? (
              <CreationResult
                type={type}
                selectedTerm={selectedTerm}
                result={result}
                onReset={() => { setResult(""); setInput(""); }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 bg-muted/30 rounded-2xl border border-dashed border-border p-8">
                <div className="text-5xl">✍️</div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">创作成果会在这里展示</p>
                  <p className="text-sm text-muted-foreground mt-1 text-pretty">
                    生成后可以：🎵 小奶音朗读 · 🎨 生成配图 · 🎬 制作动画
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {["图文并茂", "小奶音朗读", "AI动画"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

