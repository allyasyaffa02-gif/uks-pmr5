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
