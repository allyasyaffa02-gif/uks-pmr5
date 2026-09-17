import React from "react";
import DatePicker from "react-datepicker";
import type { FieldError } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  DATE_INPUT_FORMATS,
  DATE_VALUE_FORMAT,
  PICKER_LOCALE_NAME,
  PICKER_PORTAL_ID,
  fromDateValue,
  toDateValue,
} from "../../utils/dateTime";
import {
  FIELD_ERROR_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_WRAPPER_CLASS,
  getFieldClass,
} from "./fieldStyles";

export interface FormDatePickerProps {
  /** Judul field, ditampilkan di atas input beserta ikon */
  label: string;
  /** `id` + `name` input, sekaligus `htmlFor` label */
  name: string;
  /** Ikon di samping label, meniru gaya `FormInput` */
  icon?: LucideIcon;
  /** Nilai dalam format `yyyy-MM-dd` (bukan `Date`) agar siap kirim ke API */
  value?: string;
  /** Dipanggil dengan teks `yyyy-MM-dd`; kosong bila tanggal dihapus */
  onChange: (value: string) => void;
  /** Sambungkan ke `field.onBlur` react-hook-form agar status `touched` ikut terisi */
  onBlur?: VoidFunction;
  /** Sambungkan ke `fieldState.error` react-hook-form */
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Batas tanggal yang boleh dipilih */
  minDate?: Date;
  maxDate?: Date;
  /** Tanggal yang tidak boleh dipilih (mis. hari libur) */
  excludeDates?: Date[];
  /** Filter bebas, mis. hanya izinkan hari kerja */
  filterDate?: (date: Date) => boolean;
  /** Tampilkan juga daftar jam di dalam panel kalender */
  showTimeSelect?: boolean;
  /**
   * Format tampilan input. Default `["dd/MM/yyyy", "yyyy-MM-dd"]`: unsur
   * pertama dipakai untuk menampilkan, sisanya tetap diterima saat mengetik.
   */
  dateFormat?: string | string[];
  /** Kelas untuk pembungkus field, mis. `col-span-2` */
  className?: string;
  /** Kelas tambahan pada elemen input */
  inputClassName?: string;
}

/**
 * Plugin input tanggal berbasis react-datepicker dengan gaya field aplikasi:
 * label + ikon, border fokus, dan pesan error selaras `FormInput`.
 *
 * Nama hari/bulan memakai locale Indonesia dan nilai yang dihasilkan tetap
 * teks `yyyy-MM-dd` — format yang diharapkan `CreateKasusDto.tanggal` —
 * sehingga gampang dipasangkan ke react-hook-form lewat `Controller`:
 *
 * ```tsx
 * <Controller
 *   control={control}
 *   name="tanggal"
 *   rules={{ required: "Tanggal wajib diisi" }}
 *   render={({ field, fieldState }) => (
 *     <FormDatePicker
 *       label="Tanggal"
 *       icon={Calendar}
 *       name="tanggal"
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={fieldState.error}
 *     />
 *   )}
 * />
 * ```
 */
export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Pilih tanggal",
  required,
  disabled,
  readOnly,
  minDate,
  maxDate,
  excludeDates,
  filterDate,
  showTimeSelect,
  dateFormat = DATE_INPUT_FORMATS,
  className = "",
  inputClassName = "",
}) => {
  const selected = toDateValue(value, DATE_VALUE_FORMAT);

  return (
    <div className={`${FIELD_WRAPPER_CLASS} ${className}`}>
      <label htmlFor={name} className={FIELD_LABEL_CLASS}>
        {Icon && <Icon size={16} />}
        <span>{label}</span>
      </label>

      <DatePicker
        id={name}
        name={name}
        locale={PICKER_LOCALE_NAME}
        portalId={PICKER_PORTAL_ID}
        selected={selected}
        openToDate={selected ?? undefined}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        onChange={(date: Date | null) =>
          onChange(fromDateValue(date, DATE_VALUE_FORMAT))
        }
        onBlur={() => onBlur?.()}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        minDate={minDate}
        maxDate={maxDate}
        excludeDates={excludeDates}
        filterDate={filterDate}
        showTimeSelect={showTimeSelect}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        todayButton="Hari ini"
        showPopperArrow={false}
        autoComplete="off"
        ariaInvalid={error ? "true" : "false"}
        className={getFieldClass(error, inputClassName)}
        wrapperClassName="pmr-datepicker-wrapper"
        calendarClassName="pmr-datepicker"
        popperClassName="pmr-datepicker-popper"
      />

      {error && <span className={FIELD_ERROR_CLASS}>{error.message}</span>}
    </div>
  );
};

export default FormDatePicker;
