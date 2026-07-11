import { useEffect, useRef, useState } from "react";
import { Bot, Clapperboard, Globe, Loader2, Palette, Send, Sparkles, Square, User, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  type AgentLanguage,
  type ChatTurn,
  SCENE_STYLES,
  detectMediaIntent,
  extractSceneSpec,
  generateScenePicture,
  generateSceneVideo,
  loadProfile,
  rememberTopics,
  saveProfile,
  streamCultureChat,
  waitForVideo,
} from "@/services/cultureAgent";
import { generateSpeech } from "@/services/ai";

interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  pending?: boolean;
}

const LANGUAGE_OPTIONS: { id: AgentLanguage; label: string }[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
  { id: "bilingual", label: "双语 Bilingual" },
];

// 界面文案（跟随所选语言）
const UI_TEXT: Record<AgentLanguage, {
  greeting: string;
  banner: string;
  bannerSub: string;
  styleTitle: string;
  styleHint: string;
  promptsTitle: string;
  placeholder: string;
  footer: string;
  thinking: string;
  suggestions: string[];
}> = {
  zh: {
    greeting:
      "你好呀，我是知节 🌾 你的传统文化小伙伴！\n我会讲节气故事、读古诗，还会为诗句画画、做小视频。\n试试对我说：给《小池》配一幅水墨画",
    banner: "知节 · AI文化伙伴",
    bannerSub: "会讲节气、会读诗，还会为诗句画画、做小视频的传统文化智能体",
    styleTitle: "画风选择",
    styleHint: "生成图片和视频时会使用选中的画风",
    promptsTitle: "试试这样问",
    placeholder: "问我节气诗词，或说：画一幅…／做一个…视频",
    footer: "图片与视频均由 AI 生成 · 诗词原文、拼音与译文来自站内精选诗库",
    thinking: "正在思考...",
    suggestions: [
      "给《小池》配一幅水墨画",
      "把小暑的荷塘做成小视频",
      "冬至为什么要吃饺子？",
      "画一幅国潮风的春节",
      "教我读《静夜思》",
      "我们来玩诗词接龙吧！",
    ],
  },
  en: {
    greeting:
      "Hi! I'm Zhijie 🌾 your Chinese culture buddy!\nI can tell stories about the 24 solar terms, teach you Chinese poems (with pinyin!), and even paint pictures or make little videos for them.\nTry: Teach me the poem \"Spring Morning\"",
    banner: "Zhijie · AI Culture Buddy",
    bannerSub: "An AI friend who tells solar-term stories, teaches Chinese poems, and paints & animates them",
    styleTitle: "Art Style",
    styleHint: "Pictures and videos will use the selected style",
    promptsTitle: "Try asking",
    placeholder: "Ask about poems & festivals, or say: draw… / make a video of…",
    footer: "Pictures & videos are AI-generated · Poem texts, pinyin and translations come from our curated library",
    thinking: "Thinking...",
    suggestions: [
      "Teach me the poem \"Spring Morning\"",
      "Draw an ink-wash picture of \"The Little Pond\"",
      "Make a video of lotus flowers in summer",
      "Why do people eat dumplings on Dongzhi?",
      "What is the Chinese New Year like?",
      "Tell me a story about the Mid-Autumn moon",
    ],
  },
  bilingual: {
    greeting:
      "你好呀，我是知节！Hi, I'm Zhijie! 🌾\n我会用中文和英文，给你讲节气、教古诗、画画、做小视频。\nI'll teach you Chinese culture in both languages — poems come with pinyin so you can read along!",
    banner: "知节 Zhijie · AI文化伙伴 Culture Buddy",
    bannerSub: "双语讲节气、教古诗、配画做视频 · Solar terms, poems, art & videos in two languages",
    styleTitle: "画风 Art Style",
    styleHint: "生成图片和视频时会使用选中的画风 / Used for pictures & videos",
    promptsTitle: "试试这样问 Try asking",
    placeholder: "中文或English都可以 / Ask in Chinese or English",
    footer: "AI 生成内容 AI-generated · 诗词原文、拼音与译文来自精选诗库 Poems from curated library",
    thinking: "正在思考 Thinking...",
    suggestions: [
      "教我读《静夜思》 Teach me \"Thoughts on a Quiet Night\"",
      "Draw the poem \"River Snow\" 画《江雪》",
      "春节是什么？What is Chinese New Year?",
      "Make a video of plum blossoms 梅花视频",
      "我们玩诗词接龙 Let's play a poem game!",
    ],
  },
};

export default function CultureAgentPage() {
  const [profile, setProfile] = useState(() => loadProfile());
  const language = profile.language;
  const t = UI_TEXT[language];

  const [messages, setMessages] = useState<AgentMessage[]>([
    { role: "assistant", content: UI_TEXT[loadProfile().language].greeting },
  ]);
  const [input, setInput] = useState("");
  const [styleId, setStyleId] = useState(SCENE_STYLES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [speechLoadingIdx, setSpeechLoadingIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechCache = useRef<Map<string, string>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  // 卸载时停止朗读
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingIdx(null);
  };

  // 「读给我听」：复用站内 MiniMax TTS 云函数，同一段话的音频缓存复用
  const handleSpeak = async (idx: number, text: string) => {
    if (speakingIdx === idx) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
    // 去掉 emoji 和链接，控制长度，让朗读干净
    const clean = text
      .replace(/\p{Extended_Pictographic}/gu, "")
      .replace(/https?:\/\/\S+/g, "")
      .trim()
      .slice(0, 300);
    if (!clean) return;
    try {
      setSpeechLoadingIdx(idx);
      let url = speechCache.current.get(clean);
      if (!url) {
        url = await generateSpeech(clean);
        speechCache.current.set(clean, url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setSpeakingIdx(null);
      audio.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      await audio.play();
    } catch (err) {
      console.error("朗读失败:", err);
      setSpeakingIdx(null);
    } finally {
      setSpeechLoadingIdx(null);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const switchLanguage = (lang: AgentLanguage) => {
    const next = { ...profile, language: lang };
    setProfile(next);
    saveProfile(next);
    setMessages((prev) => [...prev, { role: "assistant", content: UI_TEXT[lang].greeting }]);
  };

  const updateLast = (patch: Partial<AgentMessage>) => {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });
  };

  const runMediaPipeline = async (userMsg: string, wantVideo: boolean) => {
    const zh = language !== "en";
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: zh ? "让我想想画什么…🎨" : "Let me think about the picture… 🎨",
        pending: true,
      },
    ]);
    try {
      const spec = await extractSceneSpec(userMsg);
      const style = SCENE_STYLES.find((s) => s.id === styleId) ?? SCENE_STYLES[0];
      updateLast({
        content: zh
          ? `构思好啦：${spec.scene}。正在用${style.name}风格落笔…`
          : `Got it: ${spec.scene}. Painting in ${style.nameEn} style…`,
      });

      const imageUrl = await generateScenePicture(style.build(spec));
      if (!wantVideo) {
        updateLast({
          content: zh
            ? `画好啦！${spec.scene}（${style.name} · AI生成）`
            : `Done! ${spec.scene} (${style.nameEn} · AI-generated)`,
          imageUrl,
          pending: false,
        });
        return;
      }

      updateLast({
        content: zh
          ? "画好底稿了，现在让画面动起来（大约需要1-2分钟）…🎬"
          : "The picture is ready — now making it move (about 1-2 minutes)… 🎬",
        imageUrl,
      });
      const taskId = await generateSceneVideo(imageUrl, spec);
      const videoUrl = await waitForVideo(taskId, (sec) => {
        updateLast({
          content: zh
            ? `画面正在动起来，已等待${Math.round(sec)}秒，快好啦…🎬`
            : `Animating… ${Math.round(sec)}s so far, almost there! 🎬`,
        });
      });
      updateLast({
        content: zh
          ? `小视频做好啦！${spec.scene}（AI生成）`
          : `Your little video is ready! ${spec.scene} (AI-generated)`,
        videoUrl,
        pending: false,
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "";
      updateLast({
        content: zh
          ? `哎呀，${reason || "生成出了点小问题"}，再试一次好吗？`
          : `Oops, something went wrong${reason ? ` (${reason})` : ""}. Shall we try again?`,
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

    // 沉淀话题记忆（延时记忆第一步）
    const nextProfile = rememberTopics(profile, userMsg);
    if (nextProfile !== profile) setProfile(nextProfile);

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
      language,
      nextProfile,
      (chunk) => {
        assistantContent += chunk;
        updateLast({ content: assistantContent });
      },
      () => setIsLoading(false),
      (err) => {
        console.error("文化智能体对话错误:", err);
        updateLast({
          content:
            language === "en"
              ? "Oops, my brush slipped! Please try again in a moment."
              : "哎呀，我暂时想不起来了，请稍等一下再试试吧！",
        });
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow font-serif flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                {t.banner}
              </h1>
              <p className="text-white/85 text-sm mt-1">{t.bannerSub}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/15 rounded-full p-1">
              <Globe className="w-4 h-4 text-white/80 ml-2" />
              {LANGUAGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.id}
                  size="sm"
                  variant="ghost"
                  className={`rounded-full h-7 px-3 text-xs ${
                    language === opt.id
                      ? "bg-white text-emerald-900 hover:bg-white"
                      : "text-white/85 hover:bg-white/20 hover:text-white"
                  }`}
                  onClick={() => switchLanguage(opt.id)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
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
                  {t.styleTitle}
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
                    {language === "en" ? s.nameEn : `${s.name} ${s.nameEn}`}
                  </Button>
                ))}
                <p className="text-xs text-muted-foreground pt-1">{t.styleHint}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t.promptsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {t.suggestions.map((q) => (
                  <Button
                    key={q}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 px-3 text-left whitespace-normal"
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
                  <h3 className="text-sm font-semibold text-foreground">
                    {language === "en" ? "Zhijie" : "知节"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "en"
                      ? "Chinese Culture Agent · Powered by DeepSeek"
                      : "传统文化智能体 · DeepSeek驱动"}
                  </p>
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
                            {t.thinking}
                          </span>
                        )}
                        {msg.pending && msg.content && (
                          <Loader2 className="w-3 h-3 animate-spin inline-block ml-1" />
                        )}
                        {msg.role === "assistant" && msg.content && !msg.pending && (
                          <button
                            type="button"
                            onClick={() => handleSpeak(idx, msg.content)}
                            className="mt-1.5 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                            aria-label={language === "en" ? "Read aloud" : "读给我听"}
                          >
                            {speechLoadingIdx === idx ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : speakingIdx === idx ? (
                              <Square className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            {speakingIdx === idx
                              ? language === "en" ? "Stop" : "停止"
                              : language === "en" ? "Read aloud" : "读给我听"}
                          </button>
                        )}
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="AI generated scene"
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
                    placeholder={t.placeholder}
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
                <p className="text-[10px] text-muted-foreground mt-1.5 text-center">{t.footer}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
