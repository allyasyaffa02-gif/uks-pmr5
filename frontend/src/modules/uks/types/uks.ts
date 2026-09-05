export interface KasusItem {
  id: number;
  nama: string;
  kelas: string;
  situasi: string; // "Saat Upacara" | "Hari Biasa"
  kategoriId?: number;
  tanggal: string;
  jam?: string;
  keluhan: string;
  penanganan: string;
  createdAt?: string;
}

export interface CreateKasusInput {
  nama: string;
  kelas: string;
  situasi: string;
  tanggal: string;
  jam?: string;
  keluhan: string;
  penanganan: string;
}

export interface KasusFilterParams {
  search?: string;
  situasi?: string;
}

export interface RekapKelasItem {
  kelas: string;
  total: number;
  upacara: number;
  harian: number;
}

export interface StatsSummary {
  total: number;
  upacara: number;
  harian: number;
}

export interface KategoriItem {
  id: number;
  name: string;
}
