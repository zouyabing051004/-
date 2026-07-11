
-- 实景社区照片表
CREATE TABLE community_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '匿名小朋友',
  city text NOT NULL DEFAULT '未知城市',
  solar_term_id text NOT NULL,
  solar_term_name text NOT NULL,
  image_url text NOT NULL,
  caption text,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 积分/上传记录表
CREATE TABLE community_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT '匿名小朋友',
  total_uploads integer NOT NULL DEFAULT 0,
  total_likes integer NOT NULL DEFAULT 0,
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 照片点赞记录（防重复点赞用，按 session_id 追踪）
CREATE TABLE photo_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id uuid NOT NULL REFERENCES community_photos(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(photo_id, session_id)
);

-- Storage bucket for community photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('community', 'community', true)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE community_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- community_photos: 所有人可查，任何人可插入和点赞
CREATE POLICY "anon can select photos" ON community_photos FOR SELECT TO anon USING (true);
CREATE POLICY "anon can insert photos" ON community_photos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon can update likes" ON community_photos FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- community_scores
CREATE POLICY "anon can select scores" ON community_scores FOR SELECT TO anon USING (true);
CREATE POLICY "anon can insert scores" ON community_scores FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon can update scores" ON community_scores FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- photo_likes
CREATE POLICY "anon can select likes" ON photo_likes FOR SELECT TO anon USING (true);
CREATE POLICY "anon can insert likes" ON photo_likes FOR INSERT TO anon WITH CHECK (true);

-- Storage policies
CREATE POLICY "public can read community" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'community');
CREATE POLICY "anon can upload community" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'community');
