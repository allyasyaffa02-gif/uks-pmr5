import React from "react";
import { PlusCircle, Table, BarChart3, KeyRound } from "lucide-react";

export type TabType = "input" | "data" | "rekap" | "password";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const baseTabClass =
    "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-field border-none px-4 py-3 text-[0.9rem] font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

  const inactiveClass =
    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-label-lg text-label-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors flex-1 min-w-[150px]";
  const activeClass =
    "flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-sm transition-all focus:outline-none";

  return (
    <nav className="bg-surface-container-lowest p-1.5 rounded-2xl shadow-sm flex flex-wrap sm:flex-nowrap items-center gap-1.5 overflow-x-auto">
      <button
        className={`${baseTabClass} ${
          activeTab === "input" ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange("input")}
      >
        <PlusCircle size={18} />
        <span>Catat Baru</span>
      </button>

      <button
        className={`${baseTabClass} ${
          activeTab === "data" ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange("data")}
      >
        <Table size={18} />
        <span>Data (Spreadsheet)</span>
      </button>

      <button
        className={`${baseTabClass} ${
          activeTab === "rekap" ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange("rekap")}
      >
        <BarChart3 size={18} />
        <span>Rekap per Kelas</span>
      </button>

      <button
        className={`${baseTabClass} ${
          activeTab === "password" ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange("password")}
      >
        <KeyRound size={18} />
        <span>Ganti Password</span>
      </button>
    </nav>
  );
};
