-- 传统文化智能体 · 底层诗词知识库
-- 精选层（curated=true，20首）：原文/拼音/英译均人工校准，可放心引用
-- 底层库（curated=false，480首）：原文出自开源 chinese-poetry；拼音为机器标注（pinyin_auto）

CREATE TABLE IF NOT EXISTS culture_poems (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  author TEXT NOT NULL,
  author_pinyin TEXT,
  dynasty TEXT NOT NULL,
  genre TEXT NOT NULL,              -- 唐诗 / 宋词 / 元曲 / 精选
  curated BOOLEAN NOT NULL DEFAULT FALSE,
  lines JSONB NOT NULL,             -- 原文逐句 ["...", "..."]
  pinyin JSONB,                     -- 与 lines 对应
  pinyin_auto BOOLEAN NOT NULL DEFAULT TRUE,
  english JSONB,                    -- 仅精选层：儿童友好英文意译
  themes JSONB,                     -- 主题标签（中英混合数组）
  season TEXT,
  solar_term TEXT,                  -- 关联节气/节日
  kid_note TEXT,
  kid_note_en TEXT,
  visual_keywords JSONB,            -- 画面意象（场景生成用）
  form_tag TEXT                     -- 体裁（五言绝句等）
);

CREATE INDEX IF NOT EXISTS idx_culture_poems_title ON culture_poems (title);
CREATE INDEX IF NOT EXISTS idx_culture_poems_author ON culture_poems (author);
CREATE INDEX IF NOT EXISTS idx_culture_poems_genre ON culture_poems (genre);

-- 只读开放：任何前端（站内页面、悬浮挂件）都可查询；写入仅服务端
ALTER TABLE culture_poems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "诗词库公开可读" ON culture_poems FOR SELECT TO anon, authenticated USING (true);

-- 检索函数：判断"题目/作者/主题/首句是否出现在用户问题里"，精选层优先
-- 用法（REST/JS均可）：select * from search_culture_poems('教我读静夜思', 3);
CREATE OR REPLACE FUNCTION search_culture_poems(q TEXT, max_rows INT DEFAULT 3)
RETURNS SETOF culture_poems
LANGUAGE sql STABLE
AS $$
  SELECT *
  FROM culture_poems p
  WHERE q ILIKE '%' || p.title || '%'
     OR (p.title_en IS NOT NULL AND lower(q) LIKE '%' || lower(p.title_en) || '%')
     OR q ILIKE '%' || p.author || '%'
     OR q ILIKE '%' || left(p.lines->>0, 5) || '%'
     OR EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(coalesce(p.themes, '[]'::jsonb)) t
          WHERE length(t) >= 2 AND lower(q) LIKE '%' || lower(t) || '%'
        )
  ORDER BY
    p.curated DESC,
    (q ILIKE '%' || p.title || '%') DESC,
    (q ILIKE '%' || left(p.lines->>0, 5) || '%') DESC
  LIMIT max_rows;
$$;

GRANT EXECUTE ON FUNCTION search_culture_poems(TEXT, INT) TO anon, authenticated;
