import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { ChangePasswordDto, LoginDto, ResetPasswordDto } from '../dto/auth.dto';
import { hashPassword, verifyPassword } from '../password.util';

function serializeUser(user: any) {
  return {
    id: Number(user.id),
    username: user.username,
    isAdmin: Boolean(user.isAdmin),
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(dto: LoginDto) {
    const username = dto.username?.trim();
    const user = await this.authRepository.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }
    const ok = await verifyPassword(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Username atau password salah');
    }
    return {
      success: true,
      message: 'Login berhasil',
      user: serializeUser(user),
    };
  }

  async logout() {
    // Sesi disimpan di sisi frontend (localStorage), backend stateless.
    return { success: true, message: 'Logout berhasil' };
  }

  /** Lupa password: reset hanya dengan username + password baru. */
  async resetPassword(dto: ResetPasswordDto) {
    const username = dto.username?.trim();
    const user = await this.authRepository.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`Username "${username}" tidak ditemukan`);
    }
    const hashed = await hashPassword(dto.newPassword);
    await this.authRepository.updatePasswordById(user.id, hashed);
    return { success: true, message: 'Password berhasil direset' };
  }

  /** Ganti password saat sudah login: wajib tahu password lama. */
  async changePassword(dto: ChangePasswordDto) {
    const username = dto.username?.trim();
    if (!username) {
      throw new NotFoundException('Username tidak ditemukan');
    }
    const user = await this.authRepository.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`Username "${username}" tidak ditemukan`);
    }
    const ok = await verifyPassword(dto.oldPassword, user.password);
    if (!ok) {
      throw new UnauthorizedException('Password lama salah');
    }
    const hashed = await hashPassword(dto.newPassword);
    await this.authRepository.updatePasswordById(user.id, hashed);
    return { success: true, message: 'Password berhasil diganti' };
  }
}
