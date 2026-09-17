import { format, isValid, parse } from "date-fns";
import { id } from "date-fns/locale/id";
import { registerLocale } from "react-datepicker";

/**
 * Konfigurasi & helper untuk komponen pemilih tanggal/waktu (react-datepicker).
 *
 * Nilai yang disimpan pada form (dan dikirim ke API) sengaja tetap berupa
 * teks dengan format lama agar kompatibel dengan `CreateKasusDto`:
 *   - tanggal: "yyyy-MM-dd"  (contoh "2026-09-14")
 *   - jam     : "HH.mm"      (contoh "07.15", sama seperti input `f-jam` lama)
 * Sedangkan format tampilan di input boleh berbeda (mis. "dd/MM/yyyy").
 */

/** Locale Indonesia: nama hari & bulan pada kalender ikut dilokalkan */
export const PICKER_LOCALE = id;

// Didaftarkan sekali agar `locale="id"` valid untuk seluruh pemilih.
registerLocale("id", PICKER_LOCALE);
export const PICKER_LOCALE_NAME = "id";

/** Elemen target portal popper (dibuat otomatis jika belum ada di DOM) */
export const PICKER_PORTAL_ID = "picker-portal";

/** Format nilai tanggal pada form & API */
export const DATE_VALUE_FORMAT = "yyyy-MM-dd";

/** Format tanggal saat ditampilkan di input */
export const DATE_DISPLAY_FORMAT = "dd/MM/yyyy";

/** Format nilai jam pada form & API */
export const TIME_VALUE_FORMAT = "HH.mm";

/** Alternatif format jam yang diterima saat user mengetik manual */
export const TIME_INPUT_FORMATS: string[] = [TIME_VALUE_FORMAT, "HH:mm"];

/** Alternatif format tanggal yang diterima saat user mengetik manual */
export const DATE_INPUT_FORMATS: string[] = [DATE_DISPLAY_FORMAT, DATE_VALUE_FORMAT];

/**
 * Teks -> Date (dinormalisasi ke tengah malam waktu lokal agar tidak
 * bergeser karena zona waktu). Mengembalikan null untuk nilai kosong/rusak.
 */
export const toDateValue = (
  value?: string | null,
  pattern: string = DATE_VALUE_FORMAT,
): Date | null => {
  if (!value) return null;

  // API kadang mengirim ISO penuh ("2026-09-14T00:00:00.000Z") -> ambil tanggalnya
  const text =
    pattern === DATE_VALUE_FORMAT ? value.trim().slice(0, 10) : value.trim();

  const parsed = parse(text, pattern, new Date());
  return isValid(parsed) ? parsed : null;
};

/** Date -> teks sesuai pattern; string kosong bila Date null */
export const fromDateValue = (
  date: Date | null | undefined,
  pattern: string = DATE_VALUE_FORMAT,
): string => (date ? format(date, pattern) : "");

/** Teks tanggal -> Date tengah malam */
export const parseDateValue = (value?: string | null): Date | null =>
  toDateValue(value, DATE_VALUE_FORMAT);

/** Date -> teks "yyyy-MM-dd" */
export const formatDateValue = (date?: Date | null): string =>
  fromDateValue(date, DATE_VALUE_FORMAT);

/** Teks "07.15" / "07:15" -> Date (berbasis tanggal hari ini) */
export const parseTimeValue = (value?: string | null): Date | null => {
  if (!value) return null;

  const text = value.trim();
  const now = new Date();
  for (const pattern of TIME_INPUT_FORMATS) {
    const parsed = parse(text, pattern, now);
    if (isValid(parsed)) return parsed;
  }
  return null;
};

/** Date -> teks "HH.mm" */
export const formatTimeValue = (date?: Date | null): string =>
  fromDateValue(date, TIME_VALUE_FORMAT);
