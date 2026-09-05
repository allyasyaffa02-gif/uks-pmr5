import { IsOptional, IsString } from 'class-validator';

export class FilterKasusDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  situasi?: string; // "Semua" | "Upacara" | "Saat Upacara" | "Hari Biasa"
}
