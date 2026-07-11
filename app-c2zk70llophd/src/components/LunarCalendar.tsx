import { getCurrentSolarTerm, getNextSolarTerm } from "@/data/solarTerms";
import { Calendar, Clock } from "lucide-react";

export default function LunarCalendar() {
  const currentTerm = getCurrentSolarTerm();
  const nextTerm = getNextSolarTerm();

  // 计算距离下一个节气的天数
  const now = new Date();
  const nextDate = new Date(now.getFullYear(), nextTerm.month - 1, nextTerm.day);
  const diffDays = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // 简单的农历日期显示（模拟）
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  // 简化农历计算（仅作展示用）
  const lunarMonth = lunarMonths[(now.getMonth() + 1) % 12];
  const lunarDay = lunarDays[(now.getDate() - 1) % 30];

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">节气日历</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 当前日期 */}
        <div className="bg-accent/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">今日</p>
          <p className="text-lg font-bold text-foreground">
            {now.getMonth() + 1}月{now.getDate()}日
          </p>
          <p className="text-sm text-secondary">{lunarMonth}{lunarDay}</p>
        </div>

        {/* 当前节气 */}
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">当前节气</p>
          <p className="text-lg font-bold text-primary">{currentTerm.name}</p>
          <p className="text-xs text-muted-foreground">{currentTerm.date}</p>
        </div>
      </div>

      {/* 下一个节气倒计时 */}
      <div className="mt-4 bg-secondary/10 rounded-lg p-3 flex items-center gap-3">
        <Clock className="w-5 h-5 text-secondary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            距离 <span className="text-secondary font-bold">{nextTerm.name}</span> 还有
          </p>
          <p className="text-2xl font-bold text-secondary">{diffDays} <span className="text-sm font-normal">天</span></p>
        </div>
      </div>
    </div>
  );
}