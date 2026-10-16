import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { parseDurationToSeconds } from "../../../common/Utils/duration.util";
import {
  DEFAULT_ACCESS_TTL,
  DEFAULT_AUDIENCE,
  DEFAULT_ISSUER,
  DEFAULT_REFRESH_TTL,
  DEV_FALLBACK_SECRET,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from "../auth.constants";
import type { JwtTokenPayload } from "../types/auth.types";

type SameSitePolicy = "Strict" | "Lax" | "None";

/**
 * Klaim dasar yang sama untuk access & refresh token. `jti` (id unik token)
 * dan `typ` ditambahkan oleh pemanggilnya.
 */
type TokenBasePayload = Omit<JwtTokenPayload, "typ" | "jti">;

interface TokenSubject {
  id: bigint | number;
  username: string;
  isAdmin: boolean;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  /** hash untuk kolom `user_sessions.refresh_token_hash` */
  refreshTokenHash: string;
  /** umur access token dalam detik; frontend memakai ini untuk Max-Age cookie */
  accessTokenExpiresIn: number;
  /** batas baru masa berlaku sesi (sliding window) */
  refreshTokenExpiresAt: Date;
}

/**
 * Pembuat & pemeriksa JWT sekaligus pemilik kebijakan transport token (cookie).
 * Semua service lain cukup memanggil method di sini.
 *
 * Konfigurasi dibaca lewat ConfigService di constructor - bukan konstanta modul
 * - supaya nilai dari .env sudah tersedia saat dibaca.
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly secret: string;
  private readonly issuer: string;
  private readonly audience: string;
  private readonly accessTtlRaw: string;
  private readonly refreshTtlRaw: string;
  private readonly accessTtlSeconds: number;
  private readonly refreshTtlSeconds: number;
  private readonly cookiePath: string;
  private readonly cookieSameSite: SameSitePolicy;
  private readonly cookieSecure: boolean;

  constructor(
    private readonly jwtService: JwtService,
    config: ConfigService,
  ) {
    const configuredSecret = config.get<string>("JWT_SECRET")?.trim();
    this.secret = configuredSecret || DEV_FALLBACK_SECRET;
    if (!configuredSecret) {
      this.logger.warn(
        "JWT_SECRET belum diisi - memakai secret default yang TIDAK aman. Isi JWT_SECRET di .env.",
      );
    }

    this.issuer = config.get<string>("JWT_ISSUER") ?? DEFAULT_ISSUER;
    this.audience = config.get<string>("JWT_AUDIENCE") ?? DEFAULT_AUDIENCE;

    this.accessTtlRaw =
      config.get<string>("JWT_EXPIRES_IN") ?? DEFAULT_ACCESS_TTL;
    this.refreshTtlRaw =
      config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? DEFAULT_REFRESH_TTL;
    this.accessTtlSeconds = parseDurationToSeconds(this.accessTtlRaw, 60 * 60);
    this.refreshTtlSeconds = parseDurationToSeconds(
      this.refreshTtlRaw,
      3 * 24 * 60 * 60,
    );

    this.cookiePath =
      config.get<string>("AUTH_COOKIE_PATH") ?? REFRESH_COOKIE_PATH;
    this.cookieSameSite =
      (config.get<string>("COOKIE_SAME_SITE") as SameSitePolicy | undefined) ??
      "Lax";
    // SameSite=None wajib Secure, dan produksi selalu dipaksa Secure.
    this.cookieSecure =
      config.get<string>("COOKIE_SECURE") === "true" ||
      config.get<string>("NODE_ENV") === "production" ||
      this.cookieSameSite === "None";
  }

  /** Umur access token dalam detik (ikut dikirim pada response login/refresh). */
  get accessTokenTtlSeconds(): number {
    return this.accessTtlSeconds;
  }

  /** Umur refresh token (sliding window) dalam detik. */
  get refreshTokenTtlSeconds(): number {
    return this.refreshTtlSeconds;
  }

  /** Nama cookie refresh; controller memakainya untuk membaca request. */
  get refreshCookieName(): string {
    return REFRESH_COOKIE_NAME;
  }

  private basePayload(user: TokenSubject): TokenBasePayload {
    return {
      sub: String(user.id),
      username: user.username,
      isAdmin: Boolean(user.isAdmin),
    };
  }

  private signOptions(ttlRaw: string) {
    return {
      secret: this.secret,
      // selalu berupa angka: tipe StringValue milik @types/jsonwebtoken menolak string biasa
      expiresIn: parseDurationToSeconds(ttlRaw, 60),
      issuer: this.issuer,
      audience: this.audience,
    };
  }

  /** Buat pasangan access + refresh token untuk satu sesi login. */
  async issueTokens(
    user: TokenSubject,
    sessionId: string,
  ): Promise<IssuedTokens> {
    const accessPayload: JwtTokenPayload = {
      ...this.basePayload(user),
      typ: "access",
      sid: sessionId,
      jti: this.generateTokenId(),
    };
    const refreshPayload: JwtTokenPayload = {
      ...this.basePayload(user),
      typ: "refresh",
      sid: sessionId,
      jti: this.generateTokenId(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        accessPayload,
        this.signOptions(this.accessTtlRaw),
      ),
      this.jwtService.signAsync(
        refreshPayload,
        this.signOptions(this.refreshTtlRaw),
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshTokenHash: this.hashRefreshToken(refreshToken),
      accessTokenExpiresIn: this.accessTtlSeconds,
      refreshTokenExpiresAt: this.refreshExpiryFromNow(),
    };
  }

  /** Verifikasi access token; lempar 401 bila tanda tangan/klaimnya tidak sah. */
  async verifyAccessToken(token: string): Promise<JwtTokenPayload> {
    const payload = await this.verify(token);
    if (payload.typ !== "access") {
      throw new UnauthorizedException("Token akses tidak valid");
    }
    return payload;
  }

  /** Verifikasi refresh token: jenis harus refresh dan id sesi wajib ada. */
  async verifyRefreshToken(
    token: string,
  ): Promise<JwtTokenPayload & { sid: string }> {
    const payload = await this.verify(token);
    if (payload.typ !== "refresh" || !payload.sid) {
      throw new UnauthorizedException("Refresh token tidak valid");
    }
    return payload as JwtTokenPayload & { sid: string };
  }

  private async verify(token: string): Promise<JwtTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
        secret: this.secret,
        issuer: this.issuer,
        audience: this.audience,
      });
    } catch {
      // jangan bocorkan alasan detail (kedaluwarsa vs tanda tangan salah)
      throw new UnauthorizedException(
        "Token tidak valid atau sudah kedaluwarsa. Silakan login kembali",
      );
    }
  }

  /** Id sesi acak (bukan berurutan) supaya tidak bisa ditebak. */
  generateSessionId(): string {
    return randomBytes(16).toString("hex");
  }

  /** Id unik per token; membuat setiap token (termasuk hasil rotasi) berbeda. */
  private generateTokenId(): string {
    return randomBytes(16).toString("hex");
  }

  /**
   * Refresh token tidak disimpan apa adanya di database: hash SHA-256 cukup
   * untuk mencocokkan saat rotasi, tetapi tidak bisa dipakai login bila isi
   * tabel bocor. Perbandingan memakai timingSafeEqual.
   */
  hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  compareRefreshTokenHash(token: string, storedHash: string): boolean {
    const incoming = Buffer.from(this.hashRefreshToken(token), "utf8");
    const stored = Buffer.from(storedHash ?? "", "utf8");
    if (incoming.length !== stored.length) return false;
    return timingSafeEqual(incoming, stored);
  }

  /** Masa berlaku sesi berikutnya: sekarang + TTL refresh (sliding window). */
  refreshExpiryFromNow(): Date {
    return new Date(Date.now() + this.refreshTtlSeconds * 1000);
  }

  /** Header `Set-Cookie` untuk refresh token (httpOnly). */
  buildRefreshCookie(token: string, expiresAt: Date): string {
    const maxAge = Math.max(
      0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    );

    return [
      `${REFRESH_COOKIE_NAME}=${encodeURIComponent(token)}`,
      `Path=${this.cookiePath}`,
      "HttpOnly",
      `SameSite=${this.cookieSameSite}`,
      this.cookieSecure ? "Secure" : "",
      `Max-Age=${maxAge}`,
    ]
      .filter(Boolean)
      .join("; ");
  }

  /** Header `Set-Cookie` yang menghapus cookie refresh token di browser. */
  buildRefreshCookieClearer(): string {
    return [
      `${REFRESH_COOKIE_NAME}=`,
      `Path=${this.cookiePath}`,
      "HttpOnly",
      `SameSite=${this.cookieSameSite}`,
      this.cookieSecure ? "Secure" : "",
      "Max-Age=0",
    ]
      .filter(Boolean)
      .join("; ");
  }
}
