import React from "react";
import { useUksStats } from "../../modules/uks/hooks/useUksStats";
import { Icon } from "./Icons";

const STAT_META = {
  vital_signs: {
    icon: null,
    iconClass: "bg-primary-fixed text-on-secondary-fixed",
  },
  flag: {
    icon: null,
    iconClass: "bg-tertiary-fixed text-tertiary",
  },
  event_note: {
    icon: null,
    iconClass: "bg-secondary-fixed text-on-secondary-fixed",
  },
} as const;

export const StatsCard: React.FC = () => {
  const { stats, isLoading } = useUksStats();

  const cards: { key: keyof typeof STAT_META; value: number; label: string }[] =
    [
      { key: "vital_signs", value: stats.total, label: "Total kasus" },
      { key: "flag", value: stats.upacara, label: "Saat upacara" },
      { key: "event_note", value: stats.harian, label: "Hari biasa" },
    ];

  return cards.map(({ key, value, label }) => {
    // Deklarasi variabel dilakukan sebelum return JSX
    const { icon, iconClass } = STAT_META[key] || {};

    return (
      <div
        key={key}
        className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-space-md">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass || ""}`}
          >
            <Icon name={icon || key} className="text-[26px]" />
          </div>
          <div>
            <div className="font-headline-xl text-headline-xl text-on-surface block leading-none mb-1">
              {isLoading ? "..." : value}
            </div>
            <div className="font-label-md text-label-md text-secondary block font-semibold">
              {label}
            </div>
          </div>
        </div>
        {/* <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-bold">
          Hari Ini
        </span> */}
      </div>
    );
  });
};
