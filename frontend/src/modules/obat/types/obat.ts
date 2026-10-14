export interface SatuanObatItem {
  id: number;
  name: string;
}

export interface ObatItem {
  id: number;
  name: string;
  tanggalBeli: string;
  tanggalKadaluarsa: string;
  stok: number;
  satuanId: number;
  satuan?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateObatInput {
  name: string;
  tanggalBeli: string;
  tanggalKadaluarsa: string;
  stok: number;
  satuanId: number;
}

export interface UpdateObatInput {
  name?: string;
  tanggalBeli?: string;
  tanggalKadaluarsa?: string;
  stok?: number;
  satuan?: string;
}

export type ObatFilterStatus =
  | "all"
  | "low_stock"
  | "expiring_soon"
  | "expired";

export interface ObatFilterParams {
  search?: string;
  status?: ObatFilterStatus;
}

export interface ObatSummary {
  totalJenis: number;
  totalStok: number;
  stokMenipis: number;
  mendekatiKadaluarsa: number;
  kadaluarsa: number;
}

/** Status pemrosesan satu baris pada fitur import Excel. */
export type ImportObatRowStatus = "success" | "failed";

/** Hasil pemrosesan satu baris file Excel import obat. */
export interface ImportObatRowResult {
  /** Nomor baris pada file Excel (baris judul = 1). */
  row: number;
  name: string;
  status: ImportObatRowStatus;
  /** Keterangan: alasan kegagalan, atau pesan sukses. */
  message: string;
}

/** Rekap jumlah baris hasil import obat. */
export interface ImportObatSummary {
  total: number;
  success: number;
  failed: number;
  /** Jumlah baris kosong yang diabaikan. */
  skipped: number;
}

/** Bentuk data yang dikembalikan endpoint POST /obat/import. */
export interface ImportObatResult {
  summary: ImportObatSummary;
  rows: ImportObatRowResult[];
}
