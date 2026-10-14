import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { SessionRepository } from '../repositories/session.repository';
import { TokenService } from './token.service';
import { ChangePasswordDto, LoginDto, ResetPasswordDto } from '../dto/auth.dto';
import { hashPassword, verifyPassword } from '../password.util';
import type { AuthUserView } from '../types/auth.types';

/** Info perangkat pengirim request; ikut dicatat pada baris sesi. */
export interface RequestMeta {
  userAgent?: string | null;
  ipAddress?: string | null;
}

/**
 * Hasil login/refresh. `setCookie` adalah nilai header Set-Cookie untuk refresh
 * token (httpOnly) yang wajib dipasang oleh controller.
 */
export interface AuthTokensResult {
  accessToken: string;
  expiresIn: number;
  user: AuthUserView;
  setCookie: string;
  message: string;
}

function serializeUser(user: any): AuthUserView {
  return {
    id: Number(user.id),
    username: user.username,
    isAdmin: Boolean(user.isAdmin),
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Login: verifikasi password, buka satu baris sesi, lalu terbitkan access
   * token (1 jam) + refresh token (3 hari, dirotasi tiap dipakai).
   */
  async login(dto: LoginDto, meta: RequestMeta = {}): Promise<AuthTokensResult> {
    const username = dto.username?.trim();
    const user = await this.authRepository.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const passwordMatches = await verifyPassword(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // housekeeping: buang sesi mati, lalu sisakan sejumlah sesi aktif saja
    await this.sessionRepository.deleteExpired();
    await this.sessionRepository.enforceSessionLimit(user.id);

    const sessionId = this.tokenService.generateSessionId();
    const tokens = await this.tokenService.issueTokens(user, sessionId);

    await this.sessionRepository.create({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: tokens.refreshTokenHash,
      expiresAt: tokens.refreshTokenExpiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiresIn,
      user: serializeUser(user),
      setCookie: this.tokenService.buildRefreshCookie(
        tokens.refreshToken,
        tokens.refreshTokenExpiresAt,
      ),
      message: 'Login berhasil',
    };
  }

  /**
   * Tukar refresh token (cookie httpOnly) dengan access token baru sekaligus
   * memutar refresh token-nya. Masa berlaku sesi digeser maju di sini, jadi
   * selama masih ada aktivitas sesi tidak pernah mati - dan sebaliknya, 3 hari
   * tanpa aktivitas membuat refresh token kedaluwarsa.
   */
  async refresh(
    refreshToken: string | undefined,
    meta: RequestMeta = {},
  ): Promise<AuthTokensResult> {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token tidak ditemukan. Silakan login kembali',
      );
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const session = await this.sessionRepository.findById(payload.sid);

    // hash wajib cocok: token yang sudah diputar ulang tidak berlaku lagi
    if (
      !session ||
      !this.tokenService.compareRefreshTokenHash(
        refreshToken,
        session.refreshTokenHash,
      )
    ) {
      throw new UnauthorizedException(
        'Sesi tidak valid. Silakan login kembali',
      );
    }

    if (session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      await this.sessionRepository.revokeById(session.id);
      throw new UnauthorizedException(
        'Sesi sudah berakhir. Silakan login kembali',
      );
    }

    const user = await this.authRepository.findUserById(session.userId);
    if (!user) {
      await this.sessionRepository.revokeById(session.id);
      throw new UnauthorizedException(
        'Akun tidak ditemukan. Silakan login kembali',
      );
    }

    const tokens = await this.tokenService.issueTokens(user, session.id);
    await this.sessionRepository.rotate(session.id, {
      refreshTokenHash: tokens.refreshTokenHash,
      expiresAt: tokens.refreshTokenExpiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.accessTokenExpiresIn,
      user: serializeUser(user),
      setCookie: this.tokenService.buildRefreshCookie(
        tokens.refreshToken,
        tokens.refreshTokenExpiresAt,
      ),
      message: 'Token diperbarui',
    };
  }

  /**
   * Logout: cabut baris sesi milik refresh token, lalu minta browser membuang
   * cookie-nya. Access token yang masih hidup otomatis ikut mati karena guard
   * memeriksa sesi di database.
   */
  async logout(refreshToken: string | undefined) {
    if (refreshToken) {
      try {
        const payload = await this.tokenService.verifyRefreshToken(refreshToken);
        await this.sessionRepository.revokeById(payload.sid);
      } catch {
        // token sudah tidak sah: tidak ada sesi yang perlu dicabut
      }
    }

    return {
      success: true,
      message: 'Logout berhasil',
      setCookie: this.tokenService.buildRefreshCookieClearer(),
    };
  }

  /** Profil user yang sedang login (dipakai frontend untuk memulihkan sesi). */
  async me(currentUser: AuthUserView) {
    const user = await this.authRepository.findUserById(BigInt(currentUser.id));
    if (!user) {
      throw new UnauthorizedException('Akun tidak ditemukan');
    }

    return { success: true, user: serializeUser(user) };
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

    // Semua perangkat yang masih memegang token lama langsung diputus.
    await this.sessionRepository.revokeAllForUser(user.id);

    return { success: true, message: 'Password berhasil direset' };
  }

  /** Ganti password saat sudah login: wajib tahu password lama. */
  async changePassword(dto: ChangePasswordDto, currentUser: AuthUserView) {
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

    // Password berubah = kredensial lama tidak boleh dipakai lagi. Sesi lain
    // dicabut, sesi yang sedang dipakai tetap hidup supaya tidak ter-logout
    // sendiri; refresh token yang tersimpan juga diputar ulang agar hash lama
    // (dari password lama) tidak bisa dipakai memutar token.
    if (currentUser?.sessionId && currentUser.id === Number(user.id)) {
      await this.sessionRepository.revokeOthersForUser(
        user.id,
        currentUser.sessionId,
      );

      const session = await this.sessionRepository.findActiveById(
        currentUser.sessionId,
      );
      if (session) {
        const tokens = await this.tokenService.issueTokens(user, session.id);
        await this.sessionRepository.rotate(session.id, {
          refreshTokenHash: tokens.refreshTokenHash,
          expiresAt: tokens.refreshTokenExpiresAt,
        });

        return {
          success: true,
          message: 'Password berhasil diganti',
          accessToken: tokens.accessToken,
          expiresIn: tokens.accessTokenExpiresIn,
          setCookie: this.tokenService.buildRefreshCookie(
            tokens.refreshToken,
            tokens.refreshTokenExpiresAt,
          ),
        };
      }
    }

    await this.sessionRepository.revokeAllForUser(user.id);
    return { success: true, message: 'Password berhasil diganti' };
  }
}
