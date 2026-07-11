import { useRef, useCallback } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SolarTerm } from "@/data/solarTerms";
import { toast } from "sonner";

interface KnowledgeCardProps {
  term: SolarTerm;
}

export default function KnowledgeCard({ term }: KnowledgeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (!cardRef.current) return;

    // 使用Canvas生成图片
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = 400 * scale;
    canvas.height = 560 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);

    // 背景
    ctx.fillStyle = '#F7F5F0';
    ctx.fillRect(0, 0, 400, 560);

    // 顶部装饰条
    ctx.fillStyle = '#C34E41';
    ctx.fillRect(0, 0, 400, 8);

    // 节气名称
    ctx.fillStyle = '#C34E41';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText(term.name, 200, 80);

    // 日期
    ctx.fillStyle = '#5C7A6B';
    ctx.font = '16px sans-serif';
    ctx.fillText(term.date, 200, 110);

    // 分割线
    ctx.strokeStyle = '#C34E41';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 130);
    ctx.lineTo(360, 130);
    ctx.stroke();

    // 气候
    ctx.fillStyle = '#2C2C2C';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('气候特点', 40, 165);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#555';
    wrapText(ctx, term.climate, 40, 190, 320, 20);

    // 习俗
    ctx.fillStyle = '#2C2C2C';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('传统习俗', 40, 250);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#555';
    wrapText(ctx, `吃什么：${term.customs.eat}`, 40, 275, 320, 20);
    wrapText(ctx, `做什么：${term.customs.do}`, 40, 300, 320, 20);
    wrapText(ctx, `穿什么：${term.customs.wear}`, 40, 325, 320, 20);

    // 诗词
    ctx.fillStyle = '#2C2C2C';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('节气诗词', 40, 370);
    ctx.font = 'italic 14px serif';
    ctx.fillStyle = '#5C7A6B';
    wrapText(ctx, term.poem.content, 40, 395, 320, 20);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText(`—— ${term.poem.author}《${term.poem.title}》`, 40, 440);

    // 底部
    ctx.fillStyle = '#C34E41';
    ctx.fillRect(0, 530, 400, 30);
    ctx.fillStyle = '#F7F5F0';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('二十四节气AI儿童智能互动学习平台', 200, 550);

    // 下载
    const link = document.createElement('a');
    link.download = `${term.name}节气知识卡片.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('知识卡片已保存！');
  }, [term]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `${term.name} - 二十四节气`,
        text: `${term.name}：${term.climate}`,
      }).catch(() => {});
    } else {
      toast.info('请截图分享给好朋友吧！');
    }
  }, [term]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-1" />
          保存卡片
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-1" />
          分享
        </Button>
      </div>

      {/* 卡片预览 */}
      <div
        ref={cardRef}
        className="bg-card rounded-xl border border-border p-6 shadow-card"
      >
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-primary font-serif">{term.name}</h2>
          <p className="text-sm text-secondary mt-1">{term.date}</p>
        </div>

        <div className="h-px bg-primary/20 my-4" />

        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold text-foreground">气候特点</h4>
            <p className="text-muted-foreground mt-1">{term.climate}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">传统习俗</h4>
            <p className="text-muted-foreground mt-1">吃什么：{term.customs.eat}</p>
            <p className="text-muted-foreground">做什么：{term.customs.do}</p>
            <p className="text-muted-foreground">穿什么：{term.customs.wear}</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">节气诗词</h4>
            <p className="text-secondary italic mt-1">{term.poem.content}</p>
            <p className="text-xs text-muted-foreground mt-1">—— {term.poem.author}《{term.poem.title}》</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">二十四节气AI儿童智能互动学习平台</p>
        </div>
      </div>
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  for (const char of chars) {
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}