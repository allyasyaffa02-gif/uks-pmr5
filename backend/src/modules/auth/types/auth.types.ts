/** User yang sudah lolos verifikasi JWT, ditempel ke `request.user`. */
export interface JwtTokenPayload {
  /** subject = id user dalam bentuk string (JWT tidak mengenal BigInt) */
  sub: string;
  username: string;
  isAdmin: boolean;
  /** id sesi (hanya ada di refresh token) untuk rotasi & pencabutan */
  sid?: string;
  /**
   * id unik per token. Tanpa ini, dua token yang dibuat pada detik yang sama
   * untuk sesi yang sama akan bertanda tangan identik (klaim iat/exp hanya
   * berpresisi detik) sehingga rotasi refresh token tidak benar-benar
   * membatalkan token lama.
   */
  jti: string;
  /** penanda jenis token supaya access token tidak bisa dipakai sebagai refresh */
  typ: "access" | "refresh";
}

export interface AuthUserView {
  id: number;
  username: string;
  isAdmin: boolean;
  /** id sesi yang dipakai request ini; dipakai untuk mencabut sesi lain saja */
  sessionId?: string;
}
