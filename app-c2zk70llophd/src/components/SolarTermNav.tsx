import { Link, useLocation } from "react-router-dom";
import { solarTerms, getCurrentSolarTerm } from "@/data/solarTerms";
import { cn } from "@/lib/utils";

const seasonColors: Record<string, string> = {
  '春': 'bg-green-100 text-green-800',
  '夏': 'bg-red-100 text-red-800',
  '秋': 'bg-amber-100 text-amber-800',
  '冬': 'bg-blue-100 text-blue-800',
};

export default function SolarTermNav() {
  const location = useLocation();
  const currentTerm = getCurrentSolarTerm();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground px-2">节气导航</h3>
      <div className="space-y-1">
        {solarTerms.map((term) => {
          const isActive = location.pathname === `/solar-term/${term.id}`;
          const isCurrent = term.id === currentTerm.id;
          return (
            <Link
              key={term.id}
              to={`/solar-term/${term.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-accent",
                isCurrent && !isActive && "border border-primary/30"
              )}
            >
              <span className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0",
                seasonColors[term.season]
              )}>
                {term.season}
              </span>
              <span className="truncate">{term.name}</span>
              {isCurrent && (
                <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">当前</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}