import { useEffect, useRef, useState } from "react";
import {
  Globe, Heart, Loader2, Palette, Send, Sparkles, Square, Star, User, Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AGENT_AVATAR,
  type AgentLanguage,
  type ChatTurn,
  SCENE_STYLES,
  detectMediaIntent,
  extractSceneSpec,
  generateScenePicture,
  generateSceneVideo,
  streamCultureChat,
  waitForVideo,
} from "@/services/cultureAgent";
import {
  type AgentMemory,
  EMPTY_MEMORY,
  absorbMessage,
  loadMemory,
  memoryForPrompt,
  saveMemory,
  toggleFavorite,
} from "@/services/userMemory";
import { generateSpeech } from "@/services/ai";
import { searchPoems } from "@/data/poetryLibrary";
import { PENDING_MESSAGE_KEY } from "@/components/FloatingAvatarChat";

interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  pending?: boolean;
  poemRef?: { id: string; title: string }; // 本条回答关联的诗（用于收藏）
}

const LANGUAGE_OPTIONS: { id: AgentLanguage; label: string }[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
  { id: "bilingual", label: "双语" },
];

const UI_TEXT: Record<AgentLanguage, {
  greeting: (nickname?: string) => string;
  banner: string;
  bannerSub: string;
  styleTitle: string;
  styleHint: string;
  promptsTitle: string;
  memoryTitle: string;
  memoryLogin: string;
  memoryEmpty: string;
  memoryLearned: (n: number) => string;
  memoryFav: string;
  placeholder: string;
  footer: string;
  thinking: string;
  favAdd: (t: string) => string;
  favDone: string;
  suggestions: string[];
}> = {
  zh: {
    greeting: (n) =>
      `${n ? `${n}，欢迎回来！` : "你好呀！"}我是四四 🦌 欢迎来到我的家～\n我会讲节气故事、教你读古诗，还能为诗句画画、做小视频！`,
    banner: "四四的家 · AI文化伙伴",
    bannerSub: "讲节气 · 教古诗 · 会画画 · 记得你的每一个喜好",
    styleTitle: "画风选择",
    styleHint: "画画和做视频时用这个风格",
    promptsTitle: "试试这样问",
    memoryTitle: "四四记得你",
    memoryLogin: "登录后，四四会永远记住你学过的诗和喜好，换手机也不会忘哦 🌱",
    memoryEmpty: "多和四四聊聊，我会慢慢了解你喜欢什么～",
    memoryLearned: (n) => `已经一起读过 ${n} 首诗啦`,
    memoryFav: "我收藏的诗",
    placeholder: "问我节气诗词，或说：画一幅…",
    footer: "图片与视频由 AI 生成 · 诗词原文来自 500 首精选诗库",
    thinking: "让我想想…",
    favAdd: (t) => `⭐ 收藏《${t}》`,
    favDone: "💛 已收藏",
    suggestions: ["🌙 教我读《静夜思》", "🎨 给《小池》配幅水墨画", "🥟 冬至为什么吃饺子？", "🎬 把梅花做成小视频", "🀄 我们玩诗词接龙吧！"],
  },
  en: {
    greeting: (n) =>
      `${n ? `Welcome back, ${n}!` : "Hi there!"} I'm Sisi the little deer 🦌 welcome to my home!\nI teach poems with pinyin, tell festival stories, and can paint or animate them!`,
    banner: "Sisi's Home · AI Culture Buddy",
    bannerSub: "Solar terms · Poems with pinyin · AI art · Remembers what you love",
    styleTitle: "Art Style",
    styleHint: "Used when painting & making videos",
    promptsTitle: "Try asking",
    memoryTitle: "Sisi remembers you",
    memoryLogin: "Log in and Sisi will remember your poems & interests on any device 🌱",
    memoryEmpty: "Chat with me and I'll learn what you like!",
    memoryLearned: (n) => `We've read ${n} poems together`,
    memoryFav: "My favorite poems",
    placeholder: "Ask about poems, or say: draw…",
    footer: "Pictures & videos are AI-generated · Poems from our 500-poem library",
    thinking: "Thinking…",
    favAdd: (t) => `⭐ Save "${t}"`,
    favDone: "💛 Saved",
    suggestions: ["🌙 Teach me the moon poem", "🎨 Draw the Little Pond in ink wash", "🧧 What is Chinese New Year?", "🎬 Make a video of plum blossoms", "🐉 Tell me about the Dragon Boat Festival"],
  },
  bilingual: {
    greeting: (n) =>
      `${n ? `${n}，欢迎回来！Welcome back!` : "你好呀！Hi!"} 我是四四 Sisi 🦌\n双语教古诗（带拼音）、讲节气，还会画画、做视频！`,
    banner: "四四的家 Sisi's Home",
    bannerSub: "双语教诗 · 会画画 · 记得你 | Bilingual poems · AI art · Remembers you",
    styleTitle: "画风 Art Style",
    styleHint: "画画和视频用这个风格 / Used for art & videos",
    promptsTitle: "试试 Try asking",
    memoryTitle: "四四记得你 Sisi remembers",
    memoryLogin: "登录后跨设备记住你 Log in to be remembered on any device 🌱",
    memoryEmpty: "多聊聊，我会了解你 Chat and I'll learn what you like!",
    memoryLearned: (n) => `一起读过 ${n} 首诗 poems read together`,
    memoryFav: "收藏 Favorites",
    placeholder: "中文或 English 都可以",
    footer: "AI 生成 AI-generated · 500 首诗库 500-poem library",
    thinking: "想想 Thinking…",
    favAdd: (t) => `⭐ 收藏 Save《${t}》`,
    favDone: "💛 已收藏 Saved",
    suggestions: ["🌙 教我读《静夜思》Moon poem", "🎨 Draw《江雪》River Snow", "🧧 春节 Chinese New Year?", "🎬 梅花视频 plum blossom video"],
  },
};

export default function CultureAgentPage() {
  const { user } = useAuth();
  const { lang: siteLang, setLang: setSiteLang } = useLanguage();
  const [memory, setMemory] = useState<AgentMemory>(EMPTY_MEMORY);
  const [memoryReady, setMemoryReady] = useState(false);
  const language = memory.language;
  const t = UI_TEXT[language];

  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [styleId, setStyleId] = useState(SCENE_STYLES[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [speechLoadingIdx, setSpeechLoadingIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechCache = useRef<Map<string, string>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  const memoryRef = useRef(memory);
  memoryRef.current = memory;

  // 加载专属记忆（登录=云端，游客=本地），并用记忆里的称呼打招呼
  useEffect(() => {
    let cancelled = false;
    loadMemory(user?.id ?? null).then((m) => {
      if (cancelled) return;
      setMemory(m);
      setMemoryReady(true);
      setMessages([{ role: "assistant", content: UI_TEXT[m.language].greeting(m.nickname) }]);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 悬浮四四带来的未完成请求（如"画一幅梅花"）：到家后自动继续
  const pendingHandled = useRef(false);
  useEffect(() => {
    if (!memoryReady || pendingHandled.current) return;
    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_MESSAGE_KEY);
      if (pending) sessionStorage.removeItem(PENDING_MESSAGE_KEY);
    } catch { /* ignore */ }
    if (pending) {
      pendingHandled.current = true;
      void handleSend(pending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryReady]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const updateMemory = (next: AgentMemory) => {
    setMemory(next);
    void saveMemory(user?.id ?? null, next);
  };

  const switchLanguage = (lang: AgentLanguage) => {
    const next = { ...memory, language: lang };
    updateMemory(next);
    if (lang !== "bilingual") setSiteLang(lang);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: UI_TEXT[lang].greeting(next.nickname) },
    ]);
  };

  // 左上角全站语言切换 → 四四跟随（仅当全站语言真的变化时）
  const prevSiteLang = useRef(siteLang);
  useEffect(() => {
    if (!memoryReady) { prevSiteLang.current = siteLang; return; }
    if (prevSiteLang.current !== siteLang && memoryRef.current.language !== siteLang) {
      prevSiteLang.current = siteLang;
      const next = { ...memoryRef.current, language: siteLang };
      updateMemory(next);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: UI_TEXT[siteLang].greeting(next.nickname) },
      ]);
    } else {
      prevSiteLang.current = siteLang;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLang, memoryReady]);

  const updateLast = (patch: Partial<AgentMessage>) => {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], ...patch };
      return next;
    });
  };

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingIdx(null);
  };

  const handleSpeak = async (idx: number, text: string) => {
    if (speakingIdx === idx) {
      stopSpeaking();
      return;
    }
    stopSpeaking();
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
          ? `构思好啦：${spec.scene}。正在用${style.name}风格落笔…🖌️`
          : `Got it: ${spec.scene}. Painting in ${style.nameEn} style… 🖌️`,
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
          ? "画好底稿了，现在让画面动起来（大约1-2分钟）…🎬"
          : "The picture is ready — now making it move (1-2 min)… 🎬",
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
    const userMsg = (preset ?? input).trim().replace(/^\p{Extended_Pictographic}\s*/u, "");
    if (!userMsg || isLoading || !memoryReady) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    // 沉淀专属记忆（话题/兴趣/学过的诗/自称）
    const nextMemory = absorbMessage(memoryRef.current, userMsg);
    updateMemory(nextMemory);
    const matchedPoem = searchPoems(userMsg, 1)[0];

    const intent = detectMediaIntent(userMsg);
    if (intent) {
      await runMediaPipeline(userMsg, intent === "video");
      setIsLoading(false);
      return;
    }

    const history: ChatTurn[] = messages
      .filter((m) => m.content && !m.pending)
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    abortRef.current = new AbortController();
    let assistantContent = "";
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        poemRef: matchedPoem ? { id: matchedPoem.id, title: matchedPoem.title } : undefined,
      },
    ]);

    await streamCultureChat(
      userMsg,
      history,
      language,
      memoryForPrompt(nextMemory),
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

  const isFav = (id?: string) => !!id && memory.favoritePoems.some((p) => p.id === id);

  return (
    <div className="pb-10">
      {/* 顶部 Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-700 to-amber-700">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow font-serif flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                {t.banner}
              </h1>
              <p className="text-white/85 text-sm mt-1.5">{t.bannerSub}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/15 rounded-full p-1">
              <Globe className="w-4 h-4 text-white/80 ml-2" />
              {LANGUAGE_OPTIONS.map((opt) => (
                <Button
                  key={opt.id}
                  size="sm"
                  variant="ghost"
                  className={`rounded-full h-9 px-4 text-sm ${
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
          {/* 左侧：专属记忆 + 画风 + 灵感 */}
          <div className="space-y-4">
            {/* 知节记得你 */}
            <Card className="bg-card border-border shadow-card overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  {t.memoryTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2.5">
                {!user && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.memoryLogin}</p>
                )}
                {memory.learnedPoems.length > 0 && (
                  <p className="text-xs text-foreground flex items-center gap-1.5">
                    <span className="text-base">📖</span>
                    {t.memoryLearned(memory.learnedPoems.length)}
                  </p>
                )}
                {memory.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {memory.interests.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">{t.memoryEmpty}</p>
                )}
                {memory.favoritePoems.length > 0 && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      {t.memoryFav}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {memory.favoritePoems.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:scale-105 transition-transform"
                          onClick={() =>
                            handleSend(language === "en" ? `Teach me "${p.title}"` : `教我读《${p.title}》`)
                          }
                        >
                          《{p.title}》
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  {t.styleTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {SCENE_STYLES.map((s) => (
                    <Button
                      key={s.id}
                      variant={styleId === s.id ? "default" : "outline"}
                      className="rounded-full h-10 px-4 text-sm"
                      onClick={() => setStyleId(s.id)}
                    >
                      {language === "en" ? s.nameEn : s.name}
                    </Button>
                  ))}
                </div>
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
              <CardContent className="pt-0 space-y-1.5">
                {t.suggestions.map((q) => (
                  <Button
                    key={q}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto min-h-10 py-2.5 px-3 text-left whitespace-normal rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    onClick={() => handleSend(q)}
                    disabled={isLoading || !memoryReady}
                  >
                    <span className="text-foreground">{q}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧：对话区 */}
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[600px] bg-card rounded-2xl border border-border shadow-card">
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className={`w-11 h-12 rounded-2xl overflow-hidden border border-border/60 shadow-sm ${isLoading ? "animate-bounce" : ""}`}>
                  <img src={AGENT_AVATAR} alt="四四" className="w-full h-full object-cover object-top" style={{ mixBlendMode: "multiply" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {language === "en" ? "Sisi" : "四四"}
                    {memory.nickname && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {language === "en" ? `with ${memory.nickname}` : `和${memory.nickname}在一起`}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === "en" ? "Chinese Culture Agent" : "传统文化智能体"}
                    {memory.qaCount > 0 && ` · ${memory.qaCount}${language === "en" ? " chats" : " 次对话"}`}
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === "user" ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <img src={AGENT_AVATAR} alt="四四" className="w-full h-full object-cover object-top rounded-full" style={{ mixBlendMode: "multiply" }} />
                        )}
                      </div>
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-accent text-accent-foreground rounded-bl-md"
                        }`}
                      >
                        {msg.content || (
                          <span className="inline-flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            {t.thinking}
                          </span>
                        )}
                        {msg.pending && msg.content && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin inline-block ml-1.5" />
                        )}
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt="AI generated scene"
                            className="mt-2 rounded-xl w-full max-w-[320px]"
                          />
                        )}
                        {msg.videoUrl && (
                          <video
                            src={msg.videoUrl}
                            controls
                            autoPlay
                            muted
                            loop
                            className="mt-2 rounded-xl w-full max-w-[320px]"
                          />
                        )}
                        {msg.role === "assistant" && msg.content && !msg.pending && (
                          <div className="mt-2 flex items-center gap-3 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleSpeak(idx, msg.content)}
                              className="flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition-opacity min-h-8"
                              aria-label={language === "en" ? "Read aloud" : "读给我听"}
                            >
                              {speechLoadingIdx === idx ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : speakingIdx === idx ? (
                                <Square className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                              {speakingIdx === idx
                                ? language === "en" ? "Stop" : "停止"
                                : language === "en" ? "Read aloud" : "读给我听"}
                            </button>
                            {msg.poemRef && (
                              <button
                                type="button"
                                onClick={() => updateMemory(toggleFavorite(memoryRef.current, msg.poemRef!))}
                                className="flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition-opacity min-h-8"
                              >
                                {isFav(msg.poemRef.id) ? t.favDone : t.favAdd(msg.poemRef.title)}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border">
                <div className="flex gap-2 items-end">
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
                    className="min-h-[48px] max-h-[110px] resize-none text-[15px] rounded-2xl px-4 py-3"
                    rows={1}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading || !memoryReady}
                    size="icon"
                    className="shrink-0 h-12 w-12 rounded-full"
                  >
                    <Send className="w-5 h-5" />
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
