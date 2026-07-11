// 底层诗词知识库（约 480 首：唐诗三百首全收 + 宋词名家精选 + 元曲散曲精选）
// 数据来源：开源 chinese-poetry 数据库（公有领域），繁体已转简体
// 拼音为 pypinyin 机器标注（pinyinAuto: true），个别多音字可能有出入——
// 权威读音以 poetryLibrary.ts 人工校准的精选层为准，智能体引用时会声明这一点。
// 通过动态 import 懒加载（约 300KB），不影响首屏。

export interface BasePoemEntry {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  genre: '唐诗' | '宋词' | '元曲';
  lines: string[];
  pinyin: string[];
  pinyinAuto: boolean;
  tag?: string; // 体裁（五言绝句等）
}

let cache: BasePoemEntry[] | null = null;

export async function loadBasePoetry(): Promise<BasePoemEntry[]> {
  if (!cache) {
    const mod = await import('./basePoetry.json');
    cache = mod.default as unknown as BasePoemEntry[];
  }
  return cache;
}

// 关键词检索：题目/作者/原文首句引用/体裁，按命中分排序
export async function searchBasePoetry(query: string, limit = 2): Promise<BasePoemEntry[]> {
  const all = await loadBasePoetry();
  const scored = all
    .map((poem) => {
      let score = 0;
      if (query.includes(poem.title)) score += 10;
      if (poem.title.length > 2 && query.includes(poem.title.slice(0, 3))) score += 3;
      if (query.includes(poem.author)) score += 5;
      if (poem.tag && query.includes(poem.tag)) score += 1;
      if (query.includes(poem.genre)) score += 1;
      for (const line of poem.lines) {
        if (line.length > 4 && query.includes(line.slice(0, 5))) score += 8;
      }
      return { poem, score };
    })
    .filter((s) => s.score > 3)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.poem);
}

export async function basePoetryStats(): Promise<Record<string, number>> {
  const all = await loadBasePoetry();
  const stats: Record<string, number> = { 总数: all.length };
  for (const p of all) {
    stats[p.genre] = (stats[p.genre] ?? 0) + 1;
  }
  return stats;
}

export function formatBasePoemForPrompt(poem: BasePoemEntry): string {
  const body = poem.lines
    .map((line, i) => `${line}\n  [拼音·机器标注] ${poem.pinyin[i] ?? ''}`)
    .join('\n');
  return `《${poem.title}》（${poem.dynasty}·${poem.author}，${poem.genre}）\n${body}`;
}
