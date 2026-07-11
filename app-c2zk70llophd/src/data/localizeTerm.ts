// 节气内容本地化：英文模式下用人工校准的英文内容替换中文字段
// 诗歌正文(poem.content)保持中文原文（文化本体），另附 poemEn 英文大意
import type { SolarTerm } from "./solarTerms";
import { SOLAR_TERM_EN_CONTENT } from "./solarTermsEnContent";
import type { SiteLanguage } from "@/contexts/LanguageContext";

export interface LocalizedTerm extends SolarTerm {
  poemEn?: string; // 英文模式下诗歌大意
}

// 返回按语言本地化后的节气对象（形状与 SolarTerm 一致，pages 直接替换使用）
export function localizeTerm(term: SolarTerm, lang: SiteLanguage): LocalizedTerm {
  if (lang !== "en") return term;
  const en = SOLAR_TERM_EN_CONTENT[term.id];
  if (!en) return term; // 无英文内容则回退中文，保证不缺内容

  return {
    ...term,
    date: en.date ?? term.date,
    climate: en.climate ?? term.climate,
    phenologyKids: en.phenologyKids
      ? term.phenologyKids?.map((p, i) => ({
          ...p,
          raw: en.phenologyKids![i]?.raw ?? p.raw,
          kids: en.phenologyKids![i]?.kids ?? p.kids,
        }))
      : term.phenologyKids,
    folkCustoms:
      term.folkCustoms && en.folkCustoms
        ? {
            north: { eat: en.folkCustoms.north.eat, do: en.folkCustoms.north.do },
            south: { eat: en.folkCustoms.south.eat, do: en.folkCustoms.south.do },
            kidsExplain: en.folkCustoms.kidsExplain,
          }
        : term.folkCustoms,
    customs: {
      eat: en.customs?.eat ?? term.customs.eat,
      do: en.customs?.do ?? term.customs.do,
      wear: en.customs?.wear ?? term.customs.wear,
    },
    story: {
      title: en.story?.title ?? term.story.title,
      content: en.story?.content ?? term.story.content,
    },
    poem: {
      ...term.poem,
      title: en.poemTitleEn ?? term.poem.title,
      author: en.poemAuthorEn ?? term.poem.author,
      // content 保持中文原文
      readingTip: en.readingTipEn ?? term.poem.readingTip,
    },
    poemEn: en.poemEn,
    keywords: en.keywords ?? term.keywords,
  };
}
