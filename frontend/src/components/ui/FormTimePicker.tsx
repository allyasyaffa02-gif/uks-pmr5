import React from "react";
import DatePicker from "react-datepicker";
import type { FieldError } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  PICKER_LOCALE_NAME,
  PICKER_PORTAL_ID,
  TIME_INPUT_FORMATS,
  TIME_VALUE_FORMAT,
  fromDateValue,
  parseTimeValue,
} from "../../utils/dateTime";
import {
  FIELD_ERROR_CLASS,
  FIELD_LABEL_CLASS,
  FIELD_WRAPPER_CLASS,
  getFieldClass,
} from "./fieldStyles";

export interface FormTimePickerProps {
  /** Judul field, ditampilkan di atas input beserta ikon */
  label: string;
  /** `id` + `name` input, sekaligus `htmlFor` label */
  name: string;
  /** Ikon di samping label, meniru gaya `FormInput` */
  icon?: LucideIcon;
  /** Nilai dalam format `HH.mm` (contoh `07.15`) — sama seperti kolom `jam` API */
  value?: string;
  /** Dipanggil dengan teks `HH.mm`; kosong bila jam dihapus */
  onChange: (value: string) => void;
  /** Sambungkan ke `field.onBlur` react-hook-form */
  onBlur?: VoidFunction;
  /** Sambungkan ke `fieldState.error` react-hook-form */
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Selang menit antar pilihan pada daftar jam (default: 5) */
  timeIntervals?: number;
  /** Batas jam pertama & terakhir yang ditampilkan */
  minTime?: Date;
  maxTime?: Date;
  /** Jam yang tidak boleh dipilih */
  excludeTimes?: Date[];
  /**
   * Format tampilan input. Default `["HH.mm", "HH:mm"]`: yang pertama dipakai
   * untuk menampilkan, keduanya diterima saat mengetik manual.
   */
  dateFormat?: string | string[];
  /** Kelas untuk pembungkus field, mis. `col-span-2` */
  className?: string;
  /** Kelas tambahan pada elemen input */
  inputClassName?: string;
}

/**
 * Plugin input jam berbasis react-datepicker: hanya daftar jam (tanpa panel
 * kalender) dengan gaya field aplikasi.
 *
 * Nilainya tetap teks `HH.mm` sehingga identik dengan input `f-jam` versi lama
 * dan kolom `pasien.time` di database.
 *
 * ```tsx
 * <Controller
 *   control={control}
 *   name="jam"
 *   render={({ field, fieldState }) => (
 *     <FormTimePicker
 *       label="Jam kejadian"
 *       icon={Clock}
 *       name="jam"
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       error={fieldState.error}
 *     />
 *   )}
 * />
 * ```
 */
export const FormTimePicker: React.FC<FormTimePickerProps> = ({
  label,
  name,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Pilih jam",
  required,
  disabled,
  readOnly,
  timeIntervals = 5,
  minTime,
  maxTime,
  excludeTimes,
  dateFormat = TIME_INPUT_FORMATS,
  className = "",
  inputClassName = "",
}) => {
  const selected = parseTimeValue(value);

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
          onChange(fromDateValue(date, TIME_VALUE_FORMAT))
        }
        onBlur={() => onBlur?.()}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        minTime={minTime}
        maxTime={maxTime}
        excludeTimes={excludeTimes}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption="Jam"
        showPopperArrow={false}
        autoComplete="off"
        ariaInvalid={error ? "true" : "false"}
        className={getFieldClass(error, inputClassName)}
        wrapperClassName="pmr-datepicker-wrapper"
        calendarClassName="pmr-datepicker pmr-datepicker--time-only"
        popperClassName="pmr-datepicker-popper"
      />

      {error && <span className={FIELD_ERROR_CLASS}>{error.message}</span>}
    </div>
  );
};

export default FormTimePicker;
