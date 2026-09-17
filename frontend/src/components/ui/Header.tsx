import React from 'react';
import { HeartPulse, LogOut, User } from 'lucide-react';
import { useAuth } from '../../modules/auth/hooks/useAuth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-glass p-6 shadow-card backdrop-blur-[16px]">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark text-white shadow-icon">
        <HeartPulse size={32} />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-[1.65rem] font-extrabold tracking-[-0.02em] text-transparent">
          Catatan Kesehatan Siswa
        </h1>
        <p className="text-[0.9rem] font-medium text-ink-muted">
          PMR — data siswa sakit saat upacara maupun hari biasa
        </p>
      </div>
      {user && (
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-field border border-line bg-slate-900/60 px-3 py-1.5 text-[0.82rem] font-semibold text-ink-muted">
            <User size={14} />
            {user.username}
            {user.isAdmin ? " (admin)" : ""}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            title="Keluar dari aplikasi"
            className="flex cursor-pointer items-center gap-1.5 rounded-field border border-line bg-transparent px-3 py-1.5 text-[0.82rem] font-semibold text-ink-muted transition-colors hover:border-red-400/40 hover:text-red-300"
          >
            <LogOut size={14} />
            Keluar
          </button>
        </div>
      )}
    </header>
  );
};

