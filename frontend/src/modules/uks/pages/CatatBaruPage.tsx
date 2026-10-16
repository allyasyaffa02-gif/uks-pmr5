import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUksKasus } from "../hooks/useUksKasus";
import { getObatListApi } from "../../obat/services/obat.service";
import {
  Save,
  UserCheck,
  Calendar,
  Clock,
  AlertCircle,
  Stethoscope,
  Pill,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { FormInput } from "../../../components/ui/FormInput";
import { FormTextArea } from "../../../components/ui/FormTextArea";
import { FormDatePicker } from "../../../components/ui/FormDatePicker";
import { FormTimePicker } from "../../../components/ui/FormTimePicker";
import { KasusFormValues } from "../../../types/form";
import { formatDateValue, formatTimeValue } from "../../../utils/dateTime";
import { ChipsItem } from "../types/uks";
import { ApiResponse } from "../../../types/api";
import { ObatItem } from "../../obat/types/obat";

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

  const { data: obatList = [], isLoading: isLoadingObat } = useQuery({
    queryKey: ["master-obat"],
    queryFn: () => getObatListApi(),
    select: (res) => res.data,
  });

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
      obat: [],
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
    trigger,
    formState: { errors },
  } = useForm<KasusFormValues>({
    defaultValues: getInitialValues(),
  });

  const {
    fields: obatFields,
    append: appendObat,
    remove: removeObat,
  } = useFieldArray<KasusFormValues>({
    control,
    name: "obat",
  });

  const situasiValue = watch("situasi");
  const obatValues = watch("obat") ?? [];

  // Saat ada baris obat ditambah / dihapus / diganti, jalankan ulang validasi
  // supaya peringatan "obat sudah dipilih" langsung muncul atau langsung hilang
  // tanpa perlu menekan Simpan dulu.
  const obatSignature = obatValues
    .map((item) => `${item?.obatId ?? ""}:${item?.jumlah ?? ""}`)
    .join("|");

  useEffect(() => {
    if ((getValues("obat") ?? []).length > 0) {
      void trigger("obat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obatSignature, trigger, getValues]);

  const onSubmit = async (data: KasusFormValues) => {
    try {
      // Buang baris obat yang belum dipilih, lalu konversi ke angka.
      // Duplikat obat sudah dicegah oleh validasi per baris + opsi select
      // yang dinonaktifkan, jadi di sini cukup memetakan nilainya.
      const obat = (data.obat ?? [])
        .filter((item) => item.obatId !== "")
        .map((item) => ({
          obatId: Number(item.obatId),
          jumlah: Number(item.jumlah),
        }));

      await createKasus({
        nama: data.nama.trim(),
        kelas: data.kelas.trim(),
        situasi: data.situasi,
        tanggal: data.tanggal,
        jam: data.jam?.trim(),
        keluhan: data.keluhan.trim(),
        penanganan: data.penanganan.trim(),
        obat: obat.length ? obat : undefined,
      });
      onSuccess();
    } catch (err) {
      console.error("Gagal mencatat kasus baru", err);
    }
  };

  const handleAddSuggestion = (
    field: "keluhan" | "penanganan",
    value: string,
  ) => {
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

        {/* Obat (opsional, bisa lebih dari satu) */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface">
              <Pill size={16} className="text-primary shrink-0" />
              <span>Obat</span>
              <span className="font-body-sm text-body-sm text-secondary normal-case">
                (opsional)
              </span>
            </label>
            <button
              type="button"
              onClick={() => appendObat({ obatId: "", jumlah: "1" })}
              disabled={isLoadingObat}
              className="flex cursor-pointer items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              <span>Tambah obat</span>
            </button>
          </div>

          {obatFields.length === 0 ? (
            <p className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-body-sm text-body-sm text-secondary italic">
              Belum ada obat yang ditambahkan. Obat bersifat opsional.
            </p>
          ) : (
            <div className="flex flex-col gap-space-sm">
              {obatFields.map((field, index) => {
                const selectedId = obatValues[index]?.obatId ?? "";
                const selectedObat = obatList?.find(
                  (o: ObatItem) => String(o.id) === String(selectedId),
                );
                const jumlah = Number(obatValues[index]?.jumlah ?? 0);
                const stok = selectedObat ? Number(selectedObat.stok) : 0;
                const stokKurang =
                  !!selectedObat &&
                  selectedId !== "" &&
                  Number.isFinite(jumlah) &&
                  jumlah > stok;
                // Satu obat hanya boleh dipilih sekali dalam satu form.
                const duplikat =
                  selectedId !== "" &&
                  obatValues.some(
                    (item, i) =>
                      i !== index &&
                      !!item?.obatId &&
                      String(item.obatId) === String(selectedId),
                  );
                const rowErrors = errors.obat?.[index];

                return (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-space-sm">
                      {/* Pilih obat dari master */}
                      <div className="relative flex-1">
                        <select
                          aria-label="Pilih obat"
                          className={`w-full appearance-none h-11 px-space-md pr-10 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#dc2626] transition-all border ${
                            rowErrors?.obatId
                              ? "border-red-400 focus:border-red-400"
                              : "border-white/10"
                          }`}
                          disabled={isLoadingObat}
                          {...register(`obat.${index}.obatId` as const, {
                            required: "Obat wajib dipilih",
                            validate: (value) => {
                              // Cek duplikat langsung ke nilai form terkini,
                              // bukan hanya ke state yang di-render.
                              if (!value) return true;
                              const rows = getValues("obat") ?? [];
                              const jumlahSama = rows.filter(
                                (item) =>
                                  !!item?.obatId &&
                                  String(item.obatId) === String(value),
                              ).length;
                              if (jumlahSama > 1) {
                                const nama =
                                  obatList.find(
                                    (o) => String(o.id) === String(value),
                                  )?.name ?? `ID ${value}`;
                                return `Obat "${nama}" sudah dipilih di baris lain.`;
                              }
                              return true;
                            },
                          })}
                        >
                          <option value="">
                            {isLoadingObat
                              ? "Memuat daftar obat..."
                              : "-- Pilih Obat --"}
                          </option>
                          {obatList.map((item) => {
                            const dipakaiBarisLain = obatValues.some(
                              (v, i) =>
                                i !== index &&
                                String(v?.obatId) === String(item.id),
                            );
                            return (
                              <option
                                key={item.id}
                                value={item.id}
                                disabled={dipakaiBarisLain}
                              >
                                {item.name}
                                {item.satuan ? ` (${item.satuan})` : ""}
                                {item.tanggalKadaluarsa
                                  ? ` - (Tanggal Kadaluarsa: ${item.tanggalKadaluarsa})`
                                  : ""}
                                {dipakaiBarisLain
                                  ? " - sudah dipilih"
                                  : item.stok !== undefined
                                    ? ` - Sisa stok: ${item.stok}`
                                    : ""}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary"
                        />
                      </div>

                      {/* Jumlah obat yang dipakai */}
                      <div className="flex items-start gap-space-sm">
                        <input
                          type="number"
                          min={1}
                          step={1}
                          aria-label="Jumlah obat"
                          placeholder="Jumlah"
                          className={`w-28 h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#dc2626] transition-all border ${
                            rowErrors?.jumlah || stokKurang
                              ? "border-red-400 focus:border-red-400"
                              : "border-white/10"
                          }`}
                          {...register(`obat.${index}.jumlah` as const, {
                            validate: (value) => {
                              const num = Number(value);
                              if (!value || Number.isNaN(num) || num < 1) {
                                return "Jumlah tidak valid";
                              }
                              if (
                                selectedObat &&
                                num > Number(selectedObat.stok)
                              ) {
                                return `Stok tersisa ${selectedObat.stok}`;
                              }
                              return true;
                            },
                          })}
                        />
                        <button
                          type="button"
                          aria-label="Hapus obat"
                          onClick={() => removeObat(index)}
                          className="flex items-center justify-center h-11 w-11 shrink-0 rounded-lg bg-surface-container-low text-red-400 hover:bg-primary-fixed transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Info stok / pesan error baris */}
                    {selectedObat && !rowErrors?.jumlah && !stokKurang && (
                      <span className="text-[0.78rem] text-secondary">
                        Sisa stok: {selectedObat.stok}
                        {selectedObat.satuan ? ` ${selectedObat.satuan}` : ""}
                      </span>
                    )}
                    {stokKurang && (
                      <span className="text-[0.78rem] text-red-400 font-medium">
                        Stok tidak mencukupi. Tersisa {stok}.
                      </span>
                    )}
                    {duplikat && (
                      <span className="text-[0.78rem] text-red-400 font-medium">
                        Obat ini sudah dipilih di baris lain. Pilih obat yang
                        berbeda atau hapus baris ini.
                      </span>
                    )}
                    {rowErrors?.obatId?.message && (
                      <span className="text-[0.78rem] text-red-400 font-medium">
                        {rowErrors.obatId.message}
                      </span>
                    )}
                    {!stokKurang && rowErrors?.jumlah?.message && (
                      <span className="text-[0.78rem] text-red-400 font-medium">
                        {rowErrors.jumlah.message}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
