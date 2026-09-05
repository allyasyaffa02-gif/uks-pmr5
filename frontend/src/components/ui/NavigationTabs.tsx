import React from 'react';
import { PlusCircle, Table, BarChart3 } from 'lucide-react';

export type TabType = 'input' | 'data' | 'rekap';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
        onClick={() => onTabChange('input')}
      >
        <PlusCircle size={18} />
        <span>Catat Baru</span>
      </button>

      <button
        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
        onClick={() => onTabChange('data')}
      >
        <Table size={18} />
        <span>Data (Spreadsheet)</span>
      </button>

      <button
        className={`tab-btn ${activeTab === 'rekap' ? 'active' : ''}`}
        onClick={() => onTabChange('rekap')}
      >
        <BarChart3 size={18} />
        <span>Rekap per Kelas</span>
      </button>
    </div>
  );
};
