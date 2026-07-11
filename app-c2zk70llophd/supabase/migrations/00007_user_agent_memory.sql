-- 智能体专属记忆：每个注册用户一份画像，随问答持续积累（一对一定制的基础）
-- 隐私设计（面向儿童，COPPA/GDPR-K 取向）：
--   仅存学习兴趣与进度，不存年龄/真实姓名/位置；RLS 保证只有本人可读写；游客用本地存储不入库。

CREATE TABLE public.user_agent_memory (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,                                  -- 孩子告诉智能体的称呼（非真实姓名）
  language TEXT NOT NULL DEFAULT 'zh',            -- zh / en / bilingual
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,   -- 兴趣标签（反复出现的话题沉淀而来）
  favorite_poems JSONB NOT NULL DEFAULT '[]'::jsonb, -- 收藏的诗 [{"id","title"}]
  learned_poems JSONB NOT NULL DEFAULT '[]'::jsonb,  -- 学过的诗（问过/读过）
  recent_topics JSONB NOT NULL DEFAULT '[]'::jsonb,  -- 最近聊过的话题（滚动5条）
  qa_count INTEGER NOT NULL DEFAULT 0,            -- 累计问答次数（成长感）
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_agent_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "本人可读自己的记忆" ON public.user_agent_memory
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "本人可建自己的记忆" ON public.user_agent_memory
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "本人可改自己的记忆" ON public.user_agent_memory
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "本人可删自己的记忆" ON public.user_agent_memory
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
