/**
 * Penyimpanan access token di sisi frontend.
 *
 * Token disimpan sebagai cookie dengan atribut keamanan yang tersedia untuk
 * cookie yang ditulis JavaScript: `SameSite=Strict` (tidak ikut terkirim pada
 * request lintas situs) dan `Secure` (otomatis aktif saat halaman dibuka lewat
 * HTTPS). Selanjutnya token dikirim eksplisit sebagai header
 * `Authorization: Bearer` oleh apiClient.
 *
 * Refresh token TIDAK ada di sini: backend menyimpannya pada cookie httpOnly
 * sehingga JavaScript tidak bisa membacanya (aman terhadap XSS).
 */
const ACCESS_TOKEN_COOKIE = "uks_access_token";

/** Umur cookie bila backend tidak mengirim `expiresIn` (sama dengan TTL default). */
const DEFAULT_MAX_AGE_SECONDS = 60 * 60;

function isHttps(): boolean {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  for (const part of document.cookie ? document.cookie.split("; ") : []) {
    if (!part.startsWith(prefix)) continue;

    const raw = part.slice(prefix.length);
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    "SameSite=Strict",
  ];

  if (isHttps()) parts.push("Secure");

  document.cookie = parts.join("; ");
}

export function setAccessToken(token: string, expiresInSeconds?: number): void {
  const maxAge =
    typeof expiresInSeconds === "number" &&
    Number.isFinite(expiresInSeconds) &&
    expiresInSeconds > 0
      ? Math.floor(expiresInSeconds)
      : DEFAULT_MAX_AGE_SECONDS;

  writeCookie(ACCESS_TOKEN_COOKIE, token, maxAge);
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

export function clearAccessToken(): void {
  const parts = [
    `${ACCESS_TOKEN_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Strict",
  ];

  if (isHttps()) parts.push("Secure");

  document.cookie = parts.join("; ");
}
