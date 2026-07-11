import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSpeech } from "@/services/ai";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface PoetryReaderProps {
  text: string;
  title?: string;
}

export default function PoetryReader({ text, title }: PoetryReaderProps) {
  const { lang } = useLanguage();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 关键修复：text 变化时彻底重置，避免切换诗词后仍播放旧音频
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setIsLoading(false);
  }, [text]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // 已有音频URL且对象存在，直接播放
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    // 已有URL但对象被重置（切换诗词后重新点击不应走到这里，text变化已清空audioUrl）
    if (audioUrl && !audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      return;
    }

    // 生成新语音
    setIsLoading(true);
    try {
      const url = await generateSpeech(text);
      setAudioUrl(url);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        toast.error(lang === 'en' ? 'Playback failed, please try again' : '语音播放失败，请重试');
        setIsPlaying(false);
      };

      audio.play();
    } catch (err) {
      console.error('语音合成失败:', err);
      toast.error(lang === 'en' ? 'Could not generate audio, please try again' : '语音生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-accent/50 rounded-lg p-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlay}
        disabled={isLoading}
        className="shrink-0 border border-secondary/30 text-secondary hover:bg-secondary/10"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </Button>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">
          {title ? (lang === 'en' ? `Read aloud: ${title}` : `朗读：${title}`) : (lang === 'en' ? 'Tap to play' : '点击播放朗读')}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Volume2 className="w-3 h-3" />
          {isPlaying ? (lang === 'en' ? 'Reading aloud...' : '正在朗读...') : (lang === 'en' ? 'AI voice' : 'AI语音合成')}
        </p>
      </div>
    </div>
  );
}