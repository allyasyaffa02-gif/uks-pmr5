import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateKasusDto {
  @IsNotEmpty({ message: 'Nama siswa tidak boleh kosong' })
  @IsString()
  nama: string;

  @IsNotEmpty({ message: 'Kelas tidak boleh kosong' })
  @IsString()
  kelas: string;

  @IsNotEmpty({ message: 'Kategori ID atau Situasi wajib diisi' })
  situasi: string; // "Saat Upacara" | "Hari Biasa"

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @IsString()
  tanggal: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  jam?: string;

  @IsNotEmpty({ message: 'Keluhan tidak boleh kosong' })
  @IsString()
  keluhan: string;

  @IsNotEmpty({ message: 'Penanganan tidak boleh kosong' })
  @IsString()
  penanganan: string;
}
