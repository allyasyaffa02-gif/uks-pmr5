import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Pill, Package, Calendar, Tag, AlertCircle } from "lucide-react";
import { ObatItem, CreateObatInput, SatuanObatItem } from "../types/obat";
import { useQuery } from "@tanstack/react-query";
import { getSatuanObatApi } from "../services/obat.service";

interface ObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateObatInput) => Promise<void>;
  initialData?: ObatItem | null;
  isLoading?: boolean;
}

export const ObatModal: React.FC<ObatModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);

  const satuanObat = useQuery<SatuanObatItem[]>({
    queryKey: ["satuanObat"],
    queryFn: () => getSatuanObatApi(),
  });

  const satuanOptions = satuanObat.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateObatInput>({
    defaultValues: {
      name: "",
      stok: 0,
      satuanId: satuanOptions.length > 0 ? satuanOptions[0].id : 0,
      tanggalBeli: new Date().toISOString().split("T")[0],
      tanggalKadaluarsa: "",
    },
  });

  const selectedSatuan = watch("satuanId");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        stok: initialData.stok,
        satuanId: initialData.satuanId,
        tanggalBeli: initialData.tanggalBeli,
        tanggalKadaluarsa: initialData.tanggalKadaluarsa,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      reset({
        name: "",
        stok: 10,
        satuanId: satuanOptions.length > 0 ? satuanOptions[0].id : 0,
        tanggalBeli: today,
        tanggalKadaluarsa: nextYear.toISOString().split("T")[0],
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateObatInput) => {
    await onSubmit({
      ...data,
      stok: Number(data.stok),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg border border-black/5 overflow-hidden transition-all scale-100">
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-surface-container-high/60 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
              <Pill size={22} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {isEdit ? "Edit Data Obat" : "Tambah Obat Baru"}
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">
                {isEdit
                  ? "Perbarui informasi inventaris stok obat"
                  : "Tambahkan item obat baru ke inventaris UKS"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Nama Obat */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
              <Pill size={14} className="text-primary" />
              Nama Obat
            </label>
            <input
              type="text"
              placeholder="Contoh: Paracetamol 500mg, Antasida, dll."
              className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.name
                  ? "border-error focus:border-error"
                  : "border-black/10 focus:border-primary"
              }`}
              {...register("name", {
                required: "Nama obat wajib diisi",
                maxLength: {
                  value: 120,
                  message: "Maksimal 120 karakter",
                },
              })}
            />
            {errors.name && (
              <span className="flex items-center gap-1 text-label-sm text-error">
                <AlertCircle size={12} /> {errors.name.message}
              </span>
            )}
          </div>

          {/* Stok & Satuan (2 kolom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
                <Package size={14} className="text-primary" />
                Jumlah Stok
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.stok
                    ? "border-error focus:border-error"
                    : "border-black/10 focus:border-primary"
                }`}
                {...register("stok", {
                  required: "Jumlah stok wajib diisi",
                  min: { value: 0, message: "Stok tidak boleh minus" },
                })}
              />
              {errors.stok && (
                <span className="flex items-center gap-1 text-label-sm text-error">
                  <AlertCircle size={12} /> {errors.stok.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
                <Tag size={14} className="text-primary" />
                Satuan
              </label>
              <div className="relative">
                <select
                  className={`w-full appearance-none px-3.5 py-2.5 pr-10 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.satuanId
                      ? "border-error focus:border-error"
                      : "border-black/10 focus:border-primary"
                  }`}
                  {...register("satuanId", {
                    required: "Satuan wajib diisi",
                    setValueAs: (v) => Number(v),
                  })}
                >
                  <option value="">Pilih satuan</option>
                  {satuanOptions.map((sat) => (
                    <option key={sat.id} value={sat.id}>
                      {sat.name}
                    </option>
                  ))}
                </select>

                {/* Ikon panah */}
                <svg
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface/60"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {errors.satuanId && (
                <p className="mt-1 text-sm text-error">
                  {errors.satuanId.message}
                </p>
              )}
              {errors.satuanId && (
                <span className="flex items-center gap-1 text-label-sm text-error">
                  <AlertCircle size={12} /> {errors.satuanId.message}
                </span>
              )}
            </div>
          </div>

          {/* Quick chip selector for common units */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-label-sm text-secondary mr-1">
              Rekomendasi:
            </span>
            {satuanOptions.map((sat) => (
              <button
                type="button"
                key={sat.id}
                onClick={() => setValue("satuanId", sat.id)}
                className={`px-2.5 py-1 text-label-sm rounded-lg border transition-all ${
                  selectedSatuan === sat.id
                    ? "bg-primary-container text-on-primary-container border-primary font-semibold"
                    : "bg-surface-container-low text-secondary border-black/5 hover:bg-surface-container-high"
                }`}
              >
                {sat.name}
              </button>
            ))}
          </div>

          {/* Tanggal Beli & Tanggal Kadaluarsa (2 kolom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
                <Calendar size={14} className="text-primary" />
                Tanggal Pengadaan (Beli)
              </label>
              <input
                type="date"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.tanggalBeli
                    ? "border-error focus:border-error"
                    : "border-black/10 focus:border-primary"
                }`}
                {...register("tanggalBeli", {
                  required: "Tanggal beli wajib diisi",
                })}
              />
              {errors.tanggalBeli && (
                <span className="flex items-center gap-1 text-label-sm text-error">
                  <AlertCircle size={12} /> {errors.tanggalBeli.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
                <Calendar size={14} className="text-primary" />
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  errors.tanggalKadaluarsa
                    ? "border-error focus:border-error"
                    : "border-black/10 focus:border-primary"
                }`}
                {...register("tanggalKadaluarsa", {
                  required: "Tanggal kadaluarsa wajib diisi",
                })}
              />
              {errors.tanggalKadaluarsa && (
                <span className="flex items-center gap-1 text-label-sm text-error">
                  <AlertCircle size={12} /> {errors.tanggalKadaluarsa.message}
                </span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container-high/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl font-label-lg text-label-lg text-secondary hover:bg-surface-container-low transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary-container hover:bg-primary shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>{isEdit ? "Simpan Perubahan" : "Tambah Obat"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
