import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
  @IsString()
  @MinLength(6, { message: 'Password baru minimal 6 karakter' })
  newPassword: string;
}

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty({ message: 'Password lama tidak boleh kosong' })
  @IsString()
  oldPassword: string;

  @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
  @IsString()
  @MinLength(6, { message: 'Password baru minimal 6 karakter' })
  newPassword: string;
}
