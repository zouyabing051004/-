
-- 站点统计表：按日期记录访客数和浏览量
CREATE TABLE public.site_stats (
  stat_date date PRIMARY KEY DEFAULT CURRENT_DATE,
  visitor_count bigint NOT NULL DEFAULT 0,
  pageview_count bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 任何人可读
CREATE POLICY "anyone_can_read_stats" ON public.site_stats
  FOR SELECT USING (true);

-- 通过 RPC 函数写入（SECURITY DEFINER 绕过 RLS）
CREATE POLICY "no_direct_write" ON public.site_stats
  FOR ALL TO anon, authenticated USING (false);

-- RPC：记录一次浏览（每次调用 pageview+1）
CREATE OR REPLACE FUNCTION public.record_pageview()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  result record;
BEGIN
  INSERT INTO public.site_stats (stat_date, visitor_count, pageview_count)
  VALUES (CURRENT_DATE, 0, 1)
  ON CONFLICT (stat_date) DO UPDATE
    SET pageview_count = site_stats.pageview_count + 1,
        updated_at = now()
  RETURNING visitor_count, pageview_count INTO result;

  RETURN json_build_object(
    'visitor_count', result.visitor_count,
    'pageview_count', result.pageview_count
  );
END;
$$;

-- RPC：记录一次新访客（当天首次访问时调用，visitor+1）
CREATE OR REPLACE FUNCTION public.record_new_visitor()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  result record;
BEGIN
  INSERT INTO public.site_stats (stat_date, visitor_count, pageview_count)
  VALUES (CURRENT_DATE, 1, 0)
  ON CONFLICT (stat_date) DO UPDATE
    SET visitor_count = site_stats.visitor_count + 1,
        updated_at = now()
  RETURNING visitor_count, pageview_count INTO result;

  RETURN json_build_object(
    'visitor_count', result.visitor_count,
    'pageview_count', result.pageview_count
  );
END;
$$;

-- 插入今日初始数据
INSERT INTO public.site_stats (stat_date, visitor_count, pageview_count)
VALUES (CURRENT_DATE, 10240, 98560)
ON CONFLICT (stat_date) DO NOTHING;
