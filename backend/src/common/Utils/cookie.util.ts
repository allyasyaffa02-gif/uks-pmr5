/**
 * Utilitas cookie tanpa dependency tambahan (tidak memakai cookie-parser).
 * Dipakai untuk menaruh refresh token sebagai cookie httpOnly dan membacanya
 * kembali dari header `Cookie` pada request berikutnya.
 */
export interface CookieOptions {
  /** umur cookie dalam detik; 0 = hapus cookie */
  maxAge?: number;
  /** default "/" */
  path?: string;
  httpOnly?: boolean;
  /** wajib true bila sameSite "None" atau dipakai lintas situs */
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  domain?: string;
}

/** Bentuk satu baris nilai header `Set-Cookie`. */
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? "/"}`);

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.domain) parts.push(`Domain=${options.domain}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join("; ");
}

/** Header `Set-Cookie` yang membuat browser membuang cookie tersebut. */
export function serializeExpiredCookie(
  name: string,
  options: CookieOptions = {},
): string {
  return serializeCookie(name, "", { ...options, maxAge: 0 });
}

/** Ubah header `Cookie` menjadi objek; nilai di-URL-decode bila memungkinkan. */
export function parseCookieHeader(
  header?: string | null,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;

    const key = part.slice(0, separator).trim();
    if (!key) continue;

    const rawValue = part.slice(separator + 1).trim();
    try {
      result[key] = decodeURIComponent(rawValue);
    } catch {
      // nilai ter-encode sebagian: pakai apa adanya daripada gagal total
      result[key] = rawValue;
    }
  }

  return result;
}

/** Ambil satu cookie dari header `Cookie`. */
export function readCookie(
  header: string | null | undefined,
  name: string,
): string | undefined {
  return parseCookieHeader(header)[name];
}
