// 全站语言开关（左上角）：中文 / English
// 与四四的专属记忆联动：切换全站语言时，四四的回答语言同步跟随
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type SiteLanguage = 'zh' | 'en';

const LS_KEY = 'site-language';
const AGENT_MEMORY_KEY = 'culture-agent-memory';

interface LanguageContextType {
  lang: SiteLanguage;
  setLang: (l: SiteLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => undefined,
});

function readInitial(): SiteLanguage {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
    // 首次访问：跟随浏览器语言（国际儿童默认英文界面）
    if (navigator.language && !navigator.language.toLowerCase().startsWith('zh')) return 'en';
  } catch {
    // ignore
  }
  return 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SiteLanguage>(readInitial);

  const setLang = (l: SiteLanguage) => {
    setLangState(l);
    try {
      localStorage.setItem(LS_KEY, l);
      // 同步四四的回答语言（本地记忆；云端由智能体页下次保存时带上）
      const raw = localStorage.getItem(AGENT_MEMORY_KEY);
      const memory = raw ? JSON.parse(raw) : {};
      memory.language = l;
      localStorage.setItem(AGENT_MEMORY_KEY, JSON.stringify(memory));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
