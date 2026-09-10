import React from "react";
import { useUksStats } from "../../modules/uks/hooks/useUksStats";
import { Activity, Flag, Calendar } from "lucide-react";

const STAT_META = {
  total: { icon: Activity, iconClass: "bg-primary/15 text-red-400" },
  upacara: { icon: Flag, iconClass: "bg-amber-accent/15 text-amber-accent" },
  harian: { icon: Calendar, iconClass: "bg-cyan-accent/15 text-cyan-accent" },
} as const;

export const StatsCard: React.FC = () => {
  const { stats, isLoading } = useUksStats();

  const cards: { key: keyof typeof STAT_META; value: number; label: string }[] =
    [
      { key: "total", value: stats.total, label: "Total kasus" },
      { key: "upacara", value: stats.upacara, label: "Saat upacara" },
      { key: "harian", value: stats.harian, label: "Hari biasa" },
    ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map(({ key, value, label }) => {
        const { icon: Icon, iconClass } = STAT_META[key];
        return (
          <div
            key={key}
            className="flex items-center gap-4 rounded-box border border-line bg-glass p-[18px_20px] backdrop-blur-[12px] transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-0.5 hover:border-white/[0.18]"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${iconClass}`}
            >
              <Icon size={22} />
            </div>
            <div>
              <div className="text-[1.6rem] font-extrabold leading-[1.2] text-ink">
                {isLoading ? "..." : value}
              </div>
              <div className="text-[0.82rem] font-semibold text-ink-muted">
                {label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
