
-- 1. 枚举类型
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 2. profiles 表
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  username text,
  role public.user_role NOT NULL DEFAULT 'user',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. 触发器：新用户自动同步
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (NEW.id, NEW.email, NEW.phone, 'user'::public.user_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. helper函数防递归
CREATE OR REPLACE FUNCTION public.get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

-- 5. RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_access" ON public.profiles
  FOR ALL TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "users_view_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()));

-- 6. public_profiles 视图
CREATE VIEW public.public_profiles AS
  SELECT id, role FROM public.profiles;

-- 7. Storage bucket for poem images
INSERT INTO storage.buckets (id, name, public)
VALUES ('poem-images', 'poem-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "poem_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'poem-images');

CREATE POLICY "poem_images_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'poem-images');

CREATE POLICY "poem_images_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'poem-images');
