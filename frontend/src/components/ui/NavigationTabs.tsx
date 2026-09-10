import React from 'react';
import { PlusCircle, Table, BarChart3 } from 'lucide-react';

export type TabType = 'input' | 'data' | 'rekap';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const baseTabClass =
    "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-field border-none px-4 py-3 text-[0.9rem] font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

  const inactiveClass = "bg-transparent text-ink-muted hover:bg-white/[0.04] hover:text-ink";
  const activeClass =
    "bg-gradient-to-br from-primary to-primary-deep text-white shadow-glow";

  return (
    <div className="flex gap-2 rounded-box border border-line bg-slate-900/60 p-1.5">
      <button
        className={`${baseTabClass} ${
          activeTab === 'input' ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange('input')}
      >
        <PlusCircle size={18} />
        <span>Catat Baru</span>
      </button>

      <button
        className={`${baseTabClass} ${
          activeTab === 'data' ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange('data')}
      >
        <Table size={18} />
        <span>Data (Spreadsheet)</span>
      </button>

      <button
        className={`${baseTabClass} ${
          activeTab === 'rekap' ? activeClass : inactiveClass
        }`}
        onClick={() => onTabChange('rekap')}
      >
        <BarChart3 size={18} />
        <span>Rekap per Kelas</span>
      </button>
    </div>
  );
};
