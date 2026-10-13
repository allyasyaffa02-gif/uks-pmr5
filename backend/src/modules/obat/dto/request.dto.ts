import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

// payload validation
export class CreateObatDto {
  @IsNotEmpty({ message: "Nama obat tidak boleh kosong" })
  @IsString()
  name: string;

  @IsNotEmpty({ message: "Stok tidak boleh kosong" })
  @IsNumber()
  stok: number;

  @IsNotEmpty({ message: "Satuan tidak boleh kosong" })
  @IsNumber()
  satuanId: number;

  @IsNotEmpty({ message: "Tanggal Pengadaan tidak boleh kosong" })
  @IsDateString()
  tanggalBeli: string;

  @IsNotEmpty({ message: "Tanggal Kadaluarsa tidak boleh kosong" })
  @IsDateString()
  tanggalKadaluarsa: string;
}

export type ObatStatus = "all" | "low_stock" | "expiring_soon" | "expired";

export class FilterObatDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: ObatStatus; // "Semua" | "Upacara" | "Saat Upacara" | "Hari Biasa"
}

// database data
export interface CreateObatData {
  name: string;
  stok: number;
  satuanId: number;
  tanggalBeli: Date;
  tanggalKadaluarsa: Date;
}
