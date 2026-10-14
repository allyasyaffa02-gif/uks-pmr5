import React from "react";
import { PlusCircle, Table, BarChart3, KeyRound } from "lucide-react";

export type TabType = "input" | "data" | "rekap" | "password";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * Navigasi tab utama.
 *
 * Grid 2 kolom di mobile (ikon di atas label supaya label dapat lebar penuh
 * dan tidak terpotong) lalu menjadi 4 kolom sejajar mulai `sm`.
 */
export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const baseTabClass =
    "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center text-[0.8rem] font-semibold leading-tight transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] sm:flex-row sm:gap-2 sm:px-4 sm:py-3 sm:text-[0.9rem]";

  const inactiveClass =
    "text-secondary hover:bg-surface-container-low hover:text-on-surface";
  const activeClass =
    "bg-primary-container text-on-primary-container font-semibold shadow-sm focus:outline-none";

  const tabClass = (isActive: boolean) =>
    `${baseTabClass} ${isActive ? activeClass : inactiveClass}`;

  return (
    <nav className="grid grid-cols-2 gap-1.5 rounded-2xl bg-surface-container-lowest p-1.5 shadow-sm sm:grid-cols-4">
      <button
        className={tabClass(activeTab === "input")}
        onClick={() => onTabChange("input")}
      >
        <PlusCircle size={18} className="shrink-0" />
        <span>Catat Baru</span>
      </button>

      <button
        className={tabClass(activeTab === "data")}
        onClick={() => onTabChange("data")}
      >
        <Table size={18} className="shrink-0" />
        <span>Data (Spreadsheet)</span>
      </button>

      <button
        className={tabClass(activeTab === "rekap")}
        onClick={() => onTabChange("rekap")}
      >
        <BarChart3 size={18} className="shrink-0" />
        <span>Rekap per Kelas</span>
      </button>

      <button
        className={tabClass(activeTab === "password")}
        onClick={() => onTabChange("password")}
      >
        <KeyRound size={18} className="shrink-0" />
        <span>Ganti Password</span>
      </button>
    </nav>
  );
};
