/**
 * Konversi durasi gaya `jsonwebtoken` ("1h", "3d", "900s") ke detik.
 *
 * Dipakai supaya `expiresIn` selalu dikirim sebagai angka: tipe `StringValue`
 * dari @types/jsonwebtoken menolak `string` biasa, dan umur cookie juga butuh
 * nilai detik yang sama supaya cookie dan token kedaluwarsa bersamaan.
 */
const UNIT_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

export function parseDurationToSeconds(
  value: string | number | undefined,
  fallbackSeconds: number,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0
      ? Math.floor(value)
      : fallbackSeconds;
  }

  const match = /^(\d+)\s*(s|m|h|d)?$/i.exec(String(value ?? "").trim());
  if (!match) return fallbackSeconds;

  const amount = Number(match[1]);
  const unit = (match[2] ?? "s").toLowerCase();
  const seconds = amount * (UNIT_SECONDS[unit] ?? 1);

  return seconds > 0 ? seconds : fallbackSeconds;
}
