import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload, Heart, MapPin, Camera, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/db/supabase";
import { solarTerms } from "@/data/solarTerms";
import { toast } from "sonner";

interface Photo {
  id: string;
  nickname: string;
  city: string;
  solar_term_id: string;
  solar_term_name: string;
  image_url: string;
  caption: string | null;
  likes: number;
  created_at: string;
}

// 生成/获取 session_id
function getSessionId() {
  let id = localStorage.getItem("hejian_session");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("hejian_session", id); }
  return id;
}

export default function CommunityPage() {
  const { lang } = useLanguage();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [filterTerm, setFilterTerm] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  // 上传表单
  const [form, setForm] = useState({ nickname: "", city: "", termId: "", caption: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sessionId = getSessionId();

  // 加载照片
  async function loadPhotos() {
    setLoading(true);
    let q = supabase.from("community_photos").select("*").order("created_at", { ascending: false }).limit(50);
    if (filterTerm !== "all") q = q.eq("solar_term_id", filterTerm);
    const { data } = await q;
    setPhotos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  // 加载已点赞
  async function loadLiked() {
    const { data } = await supabase.from("photo_likes").select("photo_id").eq("session_id", sessionId);
    if (data) setLikedIds(new Set(data.map((d: { photo_id: string }) => d.photo_id)));
  }

  useEffect(() => { loadPhotos(); loadLiked(); }, [filterTerm]);

  // 上传
  async function handleUpload() {
    if (!file || !form.nickname || !form.city || !form.termId) {
      toast.error("请填写完整信息并选择图片");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: up, error: upErr } = await supabase.storage.from("community").upload(path, file, { contentType: file.type });
      if (upErr || !up) throw new Error("图片上传失败");
      const { data: urlData } = supabase.storage.from("community").getPublicUrl(up.path);
      const term = solarTerms.find(t => t.id === form.termId);
      await supabase.from("community_photos").insert({
        nickname: form.nickname,
        city: form.city,
        solar_term_id: form.termId,
        solar_term_name: term?.name ?? form.termId,
        image_url: urlData.publicUrl,
        caption: form.caption || null,
      });
      toast.success("📸 分享成功！感谢记录你的节气时光～");
      setForm({ nickname: "", city: "", termId: "", caption: "" });
      setFile(null);
      setShowUpload(false);
      loadPhotos();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "上传失败，请重试");
    } finally {
      setUploading(false);
    }
  }

  // 点赞
  async function handleLike(photo: Photo) {
    if (likedIds.has(photo.id)) return;
    const { error } = await supabase.from("photo_likes").insert({ photo_id: photo.id, session_id: sessionId });
    if (error) return;
    await supabase.from("community_photos").update({ likes: photo.likes + 1 }).eq("id", photo.id);
    setLikedIds(prev => new Set([...prev, photo.id]));
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes: p.likes + 1 } : p));
  }

  const seasonColors: Record<string, string> = {
    春: "bg-emerald-100 text-emerald-700",
    夏: "bg-amber-100 text-amber-700",
    秋: "bg-orange-100 text-orange-700",
    冬: "bg-sky-100 text-sky-700",
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-16">
      {/* 页头 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-serif text-foreground flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />{lang === "en" ? "Photo Community" : "实景社区"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{lang === "en" ? "Share your seasonal photos and discover scenery across China" : "分享你拍到的节气实景，发现南北方的不同风景"}</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)} className="gap-2 shrink-0">
          <Upload className="w-4 h-4" />上传照片
        </Button>
      </div>

      {/* 上传面板 */}
      {showUpload && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <p className="font-semibold text-sm text-foreground">📸 分享你的节气实景</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="你的昵称（如：小明）" value={form.nickname} onChange={e => setForm(p => ({ ...p, nickname: e.target.value }))} />
              <Input placeholder="所在城市（如：北京）" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            </div>
            <Select value={form.termId} onValueChange={v => setForm(p => ({ ...p, termId: v }))}>
              <SelectTrigger><SelectValue placeholder="选择节气" /></SelectTrigger>
              <SelectContent>
                {solarTerms.map(t => <SelectItem key={t.id} value={t.id}>{t.season}·{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="图片描述（可选，如：今天的晨露真美）" value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} />
            <div
              className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {file
                ? <p className="text-sm text-foreground">✅ {file.name}</p>
                : <p className="text-sm text-muted-foreground">点击选择照片（最大 5MB）</p>}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUpload(false)}>取消</Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" />上传中…</> : "发布分享"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 筛选栏 */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setFilterTerm("all")}
          className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
            filterTerm === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent")}
        >全部节气</button>
        {solarTerms.map(t => (
          <button key={t.id} onClick={() => setFilterTerm(t.id)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
              filterTerm === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent")}>
            {t.name}
          </button>
        ))}
      </div>

      {/* 照片瀑布流 */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">还没有人分享实景照片</p>
          <p className="text-sm text-muted-foreground mt-1">成为第一个分享节气风景的人吧！</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {photos.map(photo => {
            const term = solarTerms.find(t => t.id === photo.solar_term_id);
            const sc = term ? seasonColors[term.season] : "bg-muted text-muted-foreground";
            const liked = likedIds.has(photo.id);
            return (
              <div key={photo.id} className="break-inside-avoid">
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img src={photo.image_url} alt={photo.caption ?? photo.solar_term_name} className="w-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", sc)}>{photo.solar_term_name}</span>
                    </div>
                  </div>
                  <CardContent className="p-2.5">
                    {photo.caption && <p className="text-xs text-foreground mb-1.5 line-clamp-2">{photo.caption}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] truncate">{photo.nickname} · {photo.city}</span>
                      </div>
                      <button
                        onClick={() => handleLike(photo)}
                        className={cn("flex items-center gap-0.5 text-[10px] shrink-0 transition-colors px-1.5 py-0.5 rounded",
                          liked ? "text-red-500" : "text-muted-foreground hover:text-red-400")}
                      >
                        <Heart className={cn("w-3 h-3", liked && "fill-current")} />
                        <span>{photo.likes}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
