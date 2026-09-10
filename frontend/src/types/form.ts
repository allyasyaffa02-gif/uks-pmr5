export interface KasusFormValues {
  nama: string;
  kelas: string;
  situasi: 'Saat Upacara' | 'Hari Biasa' | string;
  tanggal: string;
  jam?: string;
  keluhan: string;
  penanganan: string;
}
