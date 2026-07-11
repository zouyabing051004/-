import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { streamCultureChat } from "@/services/cultureAgent";
import { loadMemory, memoryForPrompt, absorbMessage, saveMemory } from "@/services/userMemory";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  context?: string; // 节气上下文
  initialMessage?: string; // 预填充问题
}

export default function AIChat({ context, initialMessage }: AIChatProps) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: lang === 'en'
        ? (context
            ? `Hi! I'm Sisi 🦌 Let's talk about "${context}"! What would you like to know?`
            : "Hi! I'm Sisi 🦌 Ask me anything about the 24 solar terms!")
        : (context
            ? `小朋友你好！我是四四 🦌 今天我们来聊聊"${context}"吧！你想知道什么呢？`
            : '小朋友你好！我是四四 🦌 二十四节气的问题都可以问我哦！你想了解哪个节气呢？')
    }
  ]);
  const [input, setInput] = useState(initialMessage ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 当 initialMessage 变化时同步到输入框
  useEffect(() => {
    if (initialMessage) setInput(initialMessage);
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    abortRef.current = new AbortController();

    let assistantContent = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const memory = await loadMemory(user?.id ?? null);
    const nextMemory = absorbMessage(memory, userMsg);
    void saveMemory(user?.id ?? null, nextMemory);
    const chatHistory = messages
      .filter(m => m.content)
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content }));
    await streamCultureChat(
      context ? `（当前正在浏览「${context}」节气页面）${userMsg}` : userMsg,
      chatHistory,
      lang,
      memoryForPrompt(nextMemory),
      (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'assistant', content: assistantContent };
          return newMsgs;
        });
      },
      () => setIsLoading(false),
      (err) => {
        console.error('AI对话错误:', err);
        setIsLoading(false);
      },
      abortRef.current.signal
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-card">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-4 h-4 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{lang === 'en' ? 'Sisi' : '四四'}</h3>
          <p className="text-xs text-muted-foreground">{lang === 'en' ? 'AI Culture Buddy' : 'AI文化伙伴'}</p>
        </div>
        {isLoading && (
          <Loader2 className="w-4 h-4 text-secondary animate-spin ml-auto" />
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary' : 'bg-secondary'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-3.5 h-3.5 text-primary-foreground" />
                  : <Bot className="w-3.5 h-3.5 text-secondary-foreground" />
                }
              </div>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}>
                {msg.content || (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    正在思考...
                  </span>
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
            onKeyDown={handleKeyDown}
            placeholder={lang === 'en' ? "What would you like to ask?" : "小朋友，你想问什么？"}
            className="min-h-[40px] max-h-[100px] resize-none text-sm"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}