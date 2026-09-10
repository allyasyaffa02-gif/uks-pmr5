import React from 'react';
import { HeartPulse } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 rounded-card border border-line bg-glass p-6 shadow-card backdrop-blur-[16px]">
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark text-white shadow-icon">
        <HeartPulse size={32} />
      </div>
      <div>
        <h1 className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-[1.65rem] font-extrabold tracking-[-0.02em] text-transparent">
          Catatan Kesehatan Siswa
        </h1>
        <p className="text-[0.9rem] font-medium text-ink-muted">
          PMR — data siswa sakit saat upacara maupun hari biasa
        </p>
      </div>
    </header>
  );
};
