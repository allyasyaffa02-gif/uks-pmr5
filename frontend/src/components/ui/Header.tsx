import React from 'react';
import { HeartPulse } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="cross-icon-wrap">
        <HeartPulse className="cross-icon" size={32} />
      </div>
      <div>
        <h1 className="title">Catatan Kesehatan Siswa</h1>
        <p className="subtitle">PMR — data siswa sakit saat upacara maupun hari biasa</p>
      </div>
    </header>
  );
};
