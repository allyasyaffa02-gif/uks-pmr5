import React, { useState } from 'react';
import { useUksKasus } from '../hooks/useUksKasus';
import { Save, UserCheck, Calendar, Clock, AlertCircle, Stethoscope } from 'lucide-react';

interface CatatBaruPageProps {
  onSuccess: () => void;
}

export const CatatBaruPage: React.FC<CatatBaruPageProps> = ({ onSuccess }) => {
  const { createKasus, isCreating } = useUksKasus();

  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [situasi, setSituasi] = useState('Saat Upacara');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [jam, setJam] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [keluhan, setKeluhan] = useState('');
  const [penanganan, setPenanganan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kelas.trim() || !keluhan.trim() || !penanganan.trim()) return;

    try {
      await createKasus({
        nama: nama.trim(),
        kelas: kelas.trim(),
        situasi,
        tanggal,
        jam: jam.trim(),
        keluhan: keluhan.trim(),
        penanganan: penanganan.trim(),
      });
      onSuccess();
    } catch (err) {
      console.error('Gagal mencatat kasus baru', err);
    }
  };

  return (
    <div className="panel-card">
      <div className="card-header">
        <h2>
          Catat kasus baru <span className="tag">FORM PMR</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label>
            <UserCheck size={16} /> Nama siswa
          </label>
          <input
            type="text"
            placeholder="Nama lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Kelas</label>
          <input
            type="text"
            placeholder="Contoh: X-2"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            required
          />
        </div>

        <div className="field full">
          <label>Situasi Kejadian</label>
          <div className="situasi-toggle">
            <button
              type="button"
              className={situasi === 'Saat Upacara' ? 'active' : ''}
              onClick={() => setSituasi('Saat Upacara')}
            >
              Saat Upacara
            </button>
            <button
              type="button"
              className={situasi === 'Hari Biasa' ? 'active' : ''}
              onClick={() => setSituasi('Hari Biasa')}
            >
              Hari Biasa
            </button>
          </div>
        </div>

        <div className="field">
          <label>
            <Calendar size={16} /> Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>
            <Clock size={16} /> Jam kejadian
          </label>
          <input
            type="text"
            placeholder="Contoh: 07.15"
            value={jam}
            onChange={(e) => setJam(e.target.value)}
          />
        </div>

        <div className="field full">
          <label>
            <AlertCircle size={16} /> Keluhan
          </label>
          <textarea
            placeholder="Contoh: Pusing, lemas, mual..."
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="field full">
          <label>
            <Stethoscope size={16} /> Penanganan
          </label>
          <textarea
            placeholder="Contoh: Dibawa ke ruang UKS, diberi minum, istirahat 15 menit..."
            value={penanganan}
            onChange={(e) => setPenanganan(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="submit-row">
          <button type="submit" className="primary-btn" disabled={isCreating}>
            <Save size={18} />
            <span>{isCreating ? 'Menyimpan...' : 'Catat kasus'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
