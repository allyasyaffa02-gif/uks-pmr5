import React from "react";
import { useUksStats } from "../../modules/uks/hooks/useUksStats";
import { Activity, Flag, Calendar } from "lucide-react";

export const StatsCard: React.FC = () => {
  const { stats, isLoading } = useUksStats();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon total">
          <Activity size={22} />
        </div>
        <div className="stat-content">
          <div className="num">{isLoading ? "..." : stats.total}</div>
          <div className="lbl">Total kasus</div>
        </div>
      </div>

      <div className="stat-card upacara">
        <div className="stat-icon upacara">
          <Flag size={22} />
        </div>
        <div className="stat-content">
          <div className="num">{isLoading ? "..." : stats.upacara}</div>
          <div className="lbl">Saat upacara</div>
        </div>
      </div>

      <div className="stat-card harian">
        <div className="stat-icon harian">
          <Calendar size={22} />
        </div>
        <div className="stat-content">
          <div className="num">{isLoading ? "..." : stats.harian}</div>
          <div className="lbl">Hari biasa</div>
        </div>
      </div>
    </div>
  );
};
