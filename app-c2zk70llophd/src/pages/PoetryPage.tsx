import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, ImageIcon, Upload, X } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { solarTermPoems } from "@/data/solarTerms";
import PoetryReader from "@/components/PoetryReader";
import { supabase } from "@/db/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function PoetryPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [selectedPoem, setSelectedPoem] = useState(solarTermPoems[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("图片不超过 5MB");
      return;
    }
    if (!user) {
      toast.error("请先登录后再上传配图");
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `poem_${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("poem-images")
        .upload(`${user.id}/${fileName}`, file, { contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("poem-images").getPublicUrl(data.path);
      setUploadedImage(urlData.publicUrl);
      toast.success("配图上传成功 🎨");
    } catch (err) {
      console.error("上传失败:", err);
      toast.error("上传失败，请重试");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <div className="pb-10">
      {/* 页面软色 Banner */}
      <div
        className="px-5 pt-7 pb-8 rounded-b-[2rem]"
        style={{ background: "#D8F2ED" }}
      >
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-1" style={{ color: "#1A4D45" }}>
          <BookOpen className="w-6 h-6" />
          {lang === "en" ? "Poems & Paintings" : "诗词配画"}
        </h1>
        <p className="text-sm font-medium" style={{ color: "#1A4D45aa" }}>{lang === "en" ? "Enjoy seasonal poems and match them with art you love" : "欣赏节气诗词，为诗词配上你喜爱的画作"}</p>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：诗词列表 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">选择诗词</h3>
            {solarTermPoems.map((poem, idx) => (
              <div
                key={idx}
                className={`cursor-pointer transition-all overflow-hidden border shadow-sm rounded-[1.5rem] ${
                  selectedPoem.title === poem.title
                    ? "border-primary shadow-md"
                    : "border-border hover:border-primary/40 hover:shadow-md"
                }`}
                style={{
                  background: selectedPoem.title === poem.title ? "#EAF7EE" : "#FFF9F0",
                }}
                onClick={() => {
                  setSelectedPoem(poem);
                  setUploadedImage(null);
                }}
              >
                <CardContent className="p-4">
                  <h4 className="font-bold text-foreground text-base">{poem.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5 font-medium">{poem.author}</p>
                  <p className="text-sm text-foreground/75 mt-2 line-clamp-2 italic leading-relaxed">
                    {poem.content}
                  </p>
                  <span
                    className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: selectedPoem.title === poem.title ? "#5BA883" : "#C8EDD6",
                      color:      selectedPoem.title === poem.title ? "#fff"    : "#1E5C35",
                    }}
                  >
                    {poem.season}
                  </span>
                </CardContent>
              </div>
            ))}
          </div>

          {/* 右侧：诗词详情 + 配图 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 诗词展示 */}
            <div
              className="rounded-[1.5rem] border overflow-hidden p-5"
              style={{ background: "#FFF9F0", borderColor: "rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
            >
              <h3 className="text-xl font-bold text-foreground mb-0.5">{selectedPoem.title}</h3>
              <p className="text-sm font-semibold text-foreground/70 mb-4">{selectedPoem.author}</p>
              <div className="flex items-start gap-3">
                <div className="w-1 bg-primary rounded-full self-stretch shrink-0" />
                <p className="text-xl text-foreground leading-loose">
                  {selectedPoem.content}
                </p>
              </div>
              <div className="mt-4">
                <PoetryReader text={selectedPoem.content} title={selectedPoem.title} />
              </div>
            </div>

            {/* 上传配图 */}
            <div
              className="rounded-[1.5rem] border overflow-hidden p-5"
              style={{ background: "#FFF9F0", borderColor: "rgba(255,255,255,0.9)", boxShadow: "var(--shadow-card)" }}
            >
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-foreground">
                <ImageIcon className="w-4 h-4 text-primary" />
                诗词配图
              </h3>
                {uploadedImage ? (
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted relative group">
                      <img
                        src={uploadedImage}
                        alt={`${selectedPoem.title}配图`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="mt-2 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border border-border bg-card hover:bg-muted transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-3.5 h-3.5 mr-0.5" />
                      重新上传
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center py-10 gap-3 border-2 border-dashed rounded-[1.25rem] cursor-pointer transition-all"
                    style={{ borderColor: "#C8EDD6" }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#EAF7EE" }}>
                      {isUploading ? (
                        <Upload className="w-7 h-7 text-primary animate-bounce" />
                      ) : (
                        <ImageIcon className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {isUploading ? "上传中..." : "点击或拖拽上传配图"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user ? "支持 JPG、PNG、GIF，最大 5MB" : "请先登录后再上传配图"}
                      </p>
                    </div>
                    {!user && (
                      <a href="/login" className="text-xs text-primary underline underline-offset-2">
                        去登录 →
                      </a>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
