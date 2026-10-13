import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

/**
 * Satu baris obat yang dipakai pada sebuah kasus UKS.
 * `obatId` merujuk ke master obat, `jumlah` = banyaknya obat yang dipakai.
 */
export class CreateKasusObatDto {
  @IsNotEmpty({ message: "Obat wajib dipilih" })
  @IsNumber({}, { message: "ID obat tidak valid" })
  @Type(() => Number)
  obatId: number;

  @IsNotEmpty({ message: "Jumlah obat wajib diisi" })
  @IsNumber({}, { message: "Jumlah obat tidak valid" })
  @Min(1, { message: "Jumlah obat minimal 1" })
  @Type(() => Number)
  jumlah: number;
}

export class CreateKasusDto {
  @IsNotEmpty({ message: "Nama siswa tidak boleh kosong" })
  @IsString()
  nama: string;

  @IsNotEmpty({ message: "Kelas tidak boleh kosong" })
  @IsString()
  kelas: string;

  @IsNotEmpty({ message: "Kategori ID atau Situasi wajib diisi" })
  situasi: string; // "Saat Upacara" | "Hari Biasa"

  @IsNotEmpty({ message: "Tanggal wajib diisi" })
  @IsString()
  tanggal: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  jam?: string;

  @IsNotEmpty({ message: "Keluhan tidak boleh kosong" })
  @IsString()
  keluhan: string;

  @IsNotEmpty({ message: "Penanganan tidak boleh kosong" })
  @IsString()
  penanganan: string;

  /**
   * Daftar obat yang diberikan (opsional, boleh lebih dari satu).
   * Tiap item: { obatId, jumlah }.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKasusObatDto)
  obat?: CreateKasusObatDto[];
}
