import type { FieldError } from "react-hook-form";

/**
 * Kelas dasar seluruh field form.
 * Dipusatkan di sini supaya input teks (FormInput/FormTextArea) dan komponen
 * pemilih tanggal/waktu (FormDatePicker/FormTimePicker) tampil identik.
 */
export const FIELD_BASE_CLASS =
  "w-full rounded-field border bg-input px-3.5 py-2.5 text-[0.92rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] placeholder:text-ink-dim focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-glow)]";

/** Pembungkus luar field: label di atas, kontrol, lalu pesan error */
export const FIELD_WRAPPER_CLASS = "flex flex-col gap-1.5";

/** Kelas `<input>`/`<textarea>` beserta status border sesuai error validasi */
export const getFieldClass = (
  error?: FieldError,
  extraClass = "",
): string =>
  `${FIELD_BASE_CLASS} ${
    error ? "border-red-400 focus:border-red-400" : "border-white/10"
  } ${extraClass}`;

/** Kelas label field (ikon + teks) */
export const FIELD_LABEL_CLASS =
  "flex items-center gap-1.5 text-[0.85rem] font-semibold text-ink-muted";

/** Kelas pesan error di bawah field */
export const FIELD_ERROR_CLASS = "text-[0.78rem] text-red-400 font-medium";
