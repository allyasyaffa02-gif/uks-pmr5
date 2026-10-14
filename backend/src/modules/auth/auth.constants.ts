/**
 * Nilai tetap seputar auth (nama cookie, TTL default, batas sesi).
 *
 * PENTING: jangan membaca `process.env` di tingkat modul di sini. File ini
 * dievaluasi saat import - yaitu SEBELUM ConfigModule.forRoot() memuat .env -
 * sehingga nilai dari .env akan terlewat. Semua pembacaan environment dilakukan
 * di dalam provider (TokenService) yang dibuat setelah .env dimuat.
 */

/** Refresh token selalu dikirim sebagai cookie httpOnly dengan jalur terbatas. */
export const REFRESH_COOKIE_NAME = "uks_refresh_token";

/**
 * Path cookie dibatasi ke endpoint auth saja; browser tidak mengirim refresh
 * token ke /api/obat atau /api/uks, jadi permukaan serangnya kecil.
 */
export const REFRESH_COOKIE_PATH = "/api/auth";

/** Access token: umur pendek, hanya untuk menandatangani request. */
export const DEFAULT_ACCESS_TTL = "1h";

/**
 * Refresh token: umur panjang dan dirotasi setiap kali dipakai. Inilah bagian
 * "sliding 3 hari" - selama dipakai, `expires_at` sesi terus digeser maju;
 * 3 hari tanpa aktivitas membuat sesi mati dan user harus login lagi.
 */
export const DEFAULT_REFRESH_TTL = "3d";

export const DEFAULT_ISSUER = "uks-pmr-backend";
export const DEFAULT_AUDIENCE = "uks-pmr-frontend";

/**
 * Dipakai hanya bila JWT_SECRET belum diisi supaya development langsung jalan.
 * Nilainya sengaja mencolok: muncul sebagai peringatan di log saat aktif.
 */
export const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-change-me";

/** Batas sesi aktif per user; sesi yang paling lama tidak dipakai dicabut. */
export const MAX_ACTIVE_SESSIONS_PER_USER = 5;
