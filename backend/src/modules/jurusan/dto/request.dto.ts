import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateJurusanDto {
  @IsNotEmpty({ message: "Nama jurusan tidak boleh kosong" })
  @IsString()
  @MaxLength(20, { message: "Nama jurusan maksimal 20 karakter" })
  name: string;
}

export class FilterJurusanDto {
  @IsOptional()
  @IsString()
  search?: string;
}