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
  /** Total baris data yang dibaca dari file (tanpa baris kosong). */
  total: number;
  success: number;
  failed: number;
  /** Jumlah baris kosong yang diabaikan. */
  skipped: number;
}

/** Bentuk data yang dikembalikan endpoint POST /obat/import. */
export interface ImportObatResult {
  summary: ImportObatSummary;
  /** Detail hasil per baris, terurut berdasarkan nomor baris. */
  rows: ImportObatRowResult[];
}

