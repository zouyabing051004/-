import { useEffect, useRef, useState } from "react";
import { Bot, Clapperboard, Loader2, Palette, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  type ChatTurn,
  SCENE_STYLES,
  detectMediaIntent,
  extractSceneSpec,
  generateScenePicture,
  generateSceneVideo,
  streamCultureChat,
  waitForVideo,
} from "@/services/cultureAgent";

interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  pending?: boolean;
}

const suggestedPrompts = [
  "给《小池》配一幅水墨画",
  "把小暑的荷塘做成小视频",
  "冬至为什么要吃饺子？",
  "画一幅国潮风的春节",
  "讲讲《山行》里的枫叶",
  "我们来玩诗词接龙吧！",
];

export default function CultureAgentPage() {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "assistant",
      content:
        "你好呀，我是知节 🌾 你的传统文化小伙伴！\n我会讲节气故事、读古诗，还会为诗句画画、做小视频。\n试试对我说：给《小池》配一幅水墨画",
    },
  ]);
  const [input, setInput] = useState("");
  const [styleId, setStyleId] = useState(SCENE_STYLES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const updateLast = (patch: Partial<AgentMessage>) => {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });
  };

  const runMediaPipeline = async (userMsg: string, wantVideo: boolean) => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "让我想想画什么…🎨", pending: true },
    ]);
    try {
      const spec = await extractSceneSpec(userMsg);
      const style = SCENE_STYLES.find((s) => s.id === styleId) ?? SCENE_STYLES[0];
      updateLast({ content: `构思好啦：${spec.scene}。正在用${style.name}风格落笔…` });

      const imageUrl = await generateScenePicture(style.build(spec));
      if (!wantVideo) {
        updateLast({
          content: `画好啦！${spec.scene}（${style.name} · AI生成）`,
          imageUrl,
          pending: false,
        });
        return;
      }

      updateLast({
        content: "画好底稿了，现在让画面动起来（大约需要1-2分钟）…🎬",
        imageUrl,
      });
      const taskId = await generateSceneVideo(imageUrl, spec);
      const videoUrl = await waitForVideo(taskId, (sec) => {
        updateLast({
          content: `画面正在动起来，已等待${Math.round(sec)}秒，快好啦…🎬`,
        });
      });
      updateLast({
        content: `小视频做好啦！${spec.scene}（AI生成）`,
        videoUrl,
        pending: false,
      });
    } catch (err) {
      updateLast({
        content: `哎呀，${err instanceof Error ? err.message : "生成出了点小问题"}，再试一次好吗？`,
        pending: false,
      });
    }
  };

  const handleSend = async (preset?: string) => {
    const userMsg = (preset ?? input).trim();
    if (!userMsg || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    const intent = detectMediaIntent(userMsg);
    if (intent) {
      await runMediaPipeline(userMsg, intent === "video");
      setIsLoading(false);
      return;
    }

    // 纯对话：流式输出
    const history: ChatTurn[] = messages
      .filter((m) => m.content && !m.pending)
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    abortRef.current = new AbortController();
    let assistantContent = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await streamCultureChat(
      userMsg,
      history,
      (chunk) => {
        assistantContent += chunk;
        updateLast({ content: assistantContent });
      },
      () => setIsLoading(false),
      (err) => {
        console.error("文化智能体对话错误:", err);
        updateLast({ content: "哎呀，我暂时想不起来了，请稍等一下再试试吧！" });
        setIsLoading(false);
      },
      abortRef.current.signal
    );
  };

  return (
    <div className="pb-10">
      {/* 顶部 Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-700 to-amber-700">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white drop-shadow font-serif flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            知节 · AI文化伙伴
          </h1>
          <p className="text-white/85 text-sm mt-1">
            会讲节气、会读诗，还会为诗句画画、做小视频的传统文化智能体
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：画风选择 + 灵感 */}
          <div className="space-y-4">
            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  画风选择
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {SCENE_STYLES.map((s) => (
                  <Button
                    key={s.id}
                    variant={styleId === s.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm h-auto py-2 px-3"
                    onClick={() => setStyleId(s.id)}
                  >
                    <Clapperboard className="w-3 h-3 mr-2 shrink-0" />
                    {s.name}
                  </Button>
                ))}
                <p className="text-xs text-muted-foreground pt-1">
                  生成图片和视频时会使用选中的画风
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  试试这样问
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {suggestedPrompts.map((q) => (
                  <Button
                    key={q}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 px-3 text-left"
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                  >
                    <span className="text-foreground">{q}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：对话区 */}
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[560px] bg-card rounded-xl border border-border shadow-card">
              <div className="flex items-center gap-2 p-4 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">知节</h3>
                  <p className="text-xs text-muted-foreground">传统文化智能体 · DeepSeek驱动</p>
                </div>
                {isLoading && <Loader2 className="w-4 h-4 text-secondary animate-spin ml-auto" />}
              </div>

              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === "user" ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-3.5 h-3.5 text-primary-foreground" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-secondary-foreground" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {msg.content || (
                          <span className="inline-flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            正在思考...
                          </span>
                        )}
                        {msg.pending && msg.content && (
                          <Loader2 className="w-3 h-3 animate-spin inline-block ml-1" />
                        )}
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="AI生成的场景配图"
                            className="mt-2 rounded-lg w-full max-w-[320px]"
                          />
                        )}
                        {msg.videoUrl && (
                          <video
                            src={msg.videoUrl}
                            controls
                            autoPlay
                            muted
                            loop
                            className="mt-2 rounded-lg w-full max-w-[320px]"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="问我节气诗词，或说：画一幅…／做一个…视频"
                    className="min-h-[40px] max-h-[100px] resize-none text-sm"
                    rows={1}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  图片与视频均由 AI 生成 · 诗词原文来自站内精选诗库
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
