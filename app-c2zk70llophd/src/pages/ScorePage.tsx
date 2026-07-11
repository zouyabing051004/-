import { useState, useEffect } from "react";
import { Trophy, Star, Camera, Heart, Loader2, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/db/supabase";

interface ScoreRow {
  rank: number;
  nickname: string;
  city: string;
  solar_term_name: string;
  likes: number;
  created_at: string;
  image_url: string;
}

export default function ScorePage() {
  const [topPhotos, setTopPhotos] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUploads, setTotalUploads] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, count } = await supabase
        .from("community_photos")
        .select("*", { count: "exact" })
        .order("likes", { ascending: false })
        .limit(20);
      setTopPhotos(
        (Array.isArray(data) ? data : []).map((r, i) => ({ ...r, rank: i + 1 }))
      );
      setTotalUploads(count ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  const rankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  const rankBg = (rank: number) => {
    if (rank === 1) return "bg-amber-50 border-amber-200";
    if (rank === 2) return "bg-slate-50 border-slate-200";
    if (rank === 3) return "bg-orange-50 border-orange-200";
    return "bg-card border-border";
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto pb-16">
      {/* 页头 */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold font-serif text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />积分排行榜
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">分享节气实景照片，收获小伙伴点赞！</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalUploads}</p>
              <p className="text-xs text-muted-foreground">总投稿数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {topPhotos.reduce((s, p) => s + p.likes, 0)}
              </p>
              <p className="text-xs text-muted-foreground">总获赞数</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 榜单说明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
        <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">如何上榜？</p>
          <p className="text-xs text-amber-700 mt-0.5">去「实景社区」上传你拍摄的节气照片，获得小伙伴点赞后即可出现在排行榜！获赞越多，排名越高！</p>
        </div>
      </div>

      {/* 排行列表 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : topPhotos.length === 0 ? (
        <div className="text-center py-20">
          <Crown className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">排行榜还没有数据</p>
          <p className="text-sm text-muted-foreground mt-1">快去实景社区分享你的节气照片吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topPhotos.map(photo => (
            <div key={photo.rank} className={`flex items-center gap-3 p-3 rounded-xl border ${rankBg(photo.rank)}`}>
              {/* 排名 */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {rankEmoji(photo.rank)}
              </div>
              {/* 照片缩略图 */}
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img src={photo.image_url} alt={photo.solar_term_name} className="w-full h-full object-cover" />
              </div>
              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-foreground truncate">{photo.nickname}</span>
                  <Badge variant="secondary" className="text-[10px] py-0">{photo.solar_term_name}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{photo.city}</p>
              </div>
              {/* 点赞数 */}
              <div className="flex items-center gap-1 shrink-0">
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span className="font-bold text-sm text-foreground">{photo.likes}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
