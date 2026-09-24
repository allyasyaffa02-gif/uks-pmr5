import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useUksKasus } from "../hooks/useUksKasus";
import {
  Save,
  UserCheck,
  Calendar,
  Clock,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { FormInput } from "../../../components/ui/FormInput";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import { FormDatePicker } from "../../../components/ui/FormDatePicker";
import { FormTimePicker } from "../../../components/ui/FormTimePicker";
import { KasusFormValues } from "../../../types/form";
import { formatDateValue, formatTimeValue } from "../../../utils/dateTime";
import { ChipsItem } from "../types/uks";

interface CatatBaruPageProps {
  onSuccess: () => void;
}

const toggleClass = (active: boolean) =>
  `flex items-center justify-center gap-space-sm h-12 rounded-lg font-label-lg text-label-lg transition-all ${
    active
      ? "border-primary bg-primary-fixed text-primary shadow-[0_0_0_2px_#dc2626]"
      : "border-white/10 bg-surface-container-low text-secondary hover:bg-surface-container-high"
  }`;

const SYMPTOM_SUGGESTIONS: ChipsItem[] = [
  { label: "+ Pusing lemas", value: "Pusing lemas" },
  { label: "+ Mual", value: "Mual / Maag" },
  { label: "+ Mimisan", value: "Mimisan" },
];

const TREATMENT_SUGGESTIONS: ChipsItem[] = [
  { label: "+ Teh Manis", value: "Diberi teh hangat manis" },
  { label: "+ Minyak Aromaterapi", value: "Diolesi minyak kayu putih" },
  { label: "+ Istirahat UKS", value: "Istirahat di ruang UKS 20 menit" },
];

const SITUASI_OPTIONS = [
  { value: "Saat Upacara", label: "Saat Upacara", icon: "flag" },
  { value: "Hari Biasa", label: "Hari Biasa / Jam KBM", icon: "event_note" },
] as const;

export const CatatBaruPage: React.FC<CatatBaruPageProps> = ({ onSuccess }) => {
  const { createKasus, isCreating } = useUksKasus();

  const getInitialValues = (): KasusFormValues => {
    const now = new Date();
    return {
      nama: "",
      kelas: "",
      situasi: "Saat Upacara",
      tanggal: formatDateValue(now),
      jam: formatTimeValue(now),
      keluhan: "",
      penanganan: "",
    };
  };

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<KasusFormValues>({
    defaultValues: getInitialValues(),
  });

  const situasiValue = watch("situasi");

  const onSubmit = async (data: KasusFormValues) => {
    try {
      await createKasus({
        nama: data.nama.trim(),
        kelas: data.kelas.trim(),
        situasi: data.situasi,
        tanggal: data.tanggal,
        jam: data.jam?.trim(),
        keluhan: data.keluhan.trim(),
        penanganan: data.penanganan.trim(),
      });
      onSuccess();
    } catch (err) {
      console.error("Gagal mencatat kasus baru", err);
    }
  };

  const handleAddSuggestion = (field: keyof KasusFormValues, value: string) => {
    const current = getValues(field) || "";
    const updated = current.trim() ? `${current.trim()}, ${value}` : value;
    setValue(field, updated, { shouldValidate: true, shouldDirty: true });
  };

  const resetFormCustom = () => {
    reset();
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
      {/* Header Form */}
      <div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg pt-space-lg rounded-t-xl">
        <div className="flex items-center gap-space-sm">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Catat Kasus Baru
          </h2>
          <span className="px-2.5 py-1 rounded bg-primary-fixed text-primary font-label-sm text-label-sm tracking-wide uppercase font-bold">
            Form PMR
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-space-xs text-secondary font-label-md text-label-md">
          <span className="material-symbols-outlined text-[18px]">
            verified_user
          </span>
          <span>Protokol Triase Pertama UKS</span>
        </div>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-lg">
        {/* Nama & Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <FormInput
            label="Nama siswa"
            icon={UserCheck}
            placeholder="Nama lengkap"
            registration={register("nama", {
              required: "Nama siswa wajib diisi",
            })}
            error={errors.nama}
          />

          <FormInput
            label="Kelas"
            placeholder="Contoh: X-2"
            registration={register("kelas", { required: "Kelas wajib diisi" })}
            error={errors.kelas}
          />
        </div>

        {/* Situasi Kejadian */}
        <div className="flex flex-col space-y-2">
          <label className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">
              crisis_alert
            </span>
            <span>Situasi Kejadian</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {SITUASI_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={toggleClass(situasiValue === opt.value)}
                onClick={() => setValue("situasi", opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tanggal & Jam */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <Controller
            name="tanggal"
            control={control}
            rules={{ required: "Tanggal wajib diisi" }}
            render={({ field, fieldState }) => (
              <FormDatePicker
                label="Tanggal"
                icon={Calendar}
                name="tanggal"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error}
              />
            )}
          />

          <Controller
            name="jam"
            control={control}
            rules={{
              validate: (value) =>
                !value ||
                /^([01]\d|2[0-3])[.:][0-5]\d$/.test(value.trim()) ||
                "Format jam tidak valid (contoh: 07.15)",
            }}
            render={({ field, fieldState }) => (
              <FormTimePicker
                label="Jam kejadian"
                icon={Clock}
                name="jam"
                placeholder="Contoh: 07.15"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error}
              />
            )}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          {/* Keluhan dengan Suggestions */}
          <FormTextArea
            label="Keluhan"
            suggestions={SYMPTOM_SUGGESTIONS}
            onSuggestionClick={(val) => handleAddSuggestion("keluhan", val)}
            icon={AlertCircle}
            placeholder="Contoh: Pusing, lemas, mual..."
            registration={register("keluhan", {
              required: "Keluhan wajib diisi",
            })}
            error={errors.keluhan}
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          {/* Penanganan dengan Suggestions */}
          <FormTextArea
            label="Penanganan"
            suggestions={TREATMENT_SUGGESTIONS}
            onSuggestionClick={(val) => handleAddSuggestion("penanganan", val)}
            icon={Stethoscope}
            placeholder="Contoh: Dibawa ke ruang UKS, diberi minum, istirahat 15 menit..."
            registration={register("penanganan", {
              required: "Penanganan wajib diisi",
            })}
            error={errors.penanganan}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-space-md gap-space-md">
          <div className="flex items-center gap-space-xs text-secondary font-body-sm text-body-sm text-center sm:text-left">
            <span className="material-symbols-outlined text-[18px] text-primary">
              cloud_done
            </span>
            <span>Data diverifikasi oleh tim piket jaga PMR sekolah.</span>
          </div>
          <div className="flex items-center gap-space-sm w-full sm:w-auto">
            <button
              className="w-1/2 sm:w-auto px-space-lg py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg transition-all"
              onClick={resetFormCustom}
              type="reset"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="flex cursor-pointer items-center justify-center gap-space-xs px-space-xl py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-md hover:bg-primary transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isCreating}
            >
              <Save size={18} />
              <span>{isCreating ? "Menyimpan..." : "Catat kasus"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CatatBaruPage;
