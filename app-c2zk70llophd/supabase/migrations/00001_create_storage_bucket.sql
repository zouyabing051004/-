-- 创建音频存储桶
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-audio', 'generated-audio', true);

-- 允许匿名用户上传和读取
CREATE POLICY "允许匿名上传音频" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'generated-audio');
CREATE POLICY "允许匿名读取音频" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'generated-audio');