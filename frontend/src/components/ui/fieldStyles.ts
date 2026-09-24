import type { FieldError } from "react-hook-form";

/**
 * Kelas dasar seluruh field form.
 * Dipusatkan di sini supaya input teks (FormInput/FormTextArea) dan komponen
 * pemilih tanggal/waktu (FormDatePicker/FormTimePicker) tampil identik.
 */
export const FIELD_BASE_CLASS =
  "w-full rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-secondary/60 focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#dc2626] transition-all";

export const INPUT_FIELD_CLASS = `${FIELD_BASE_CLASS} h-11 px-space-md`;
export const TEXTAREA_FIELD_CLASS = `${FIELD_BASE_CLASS} p-space-md resize-y`;

/** Pembungkus luar field: label di atas, kontrol, lalu pesan error */
export const FIELD_WRAPPER_CLASS = "flex flex-col gap-1.5";

/** Kelas label field (ikon + teks) */
export const FIELD_LABEL_CLASS =
  "flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface";

/** Kelas pesan error di bawah field */
export const FIELD_ERROR_CLASS = "text-[0.78rem] text-red-400 font-medium";

/** Kelas `<input>`/`<textarea>` beserta status border sesuai error validasi */
export const getFieldClass = (
  error?: FieldError | boolean,
  extraClass = "",
  isTextArea = false
): string => {
  const base = isTextArea ? TEXTAREA_FIELD_CLASS : INPUT_FIELD_CLASS;
  const borderState = error ? "border-red-400 focus:border-red-400" : "border-white/10";
  return `${base} ${borderState} ${extraClass}`.trim();
};

