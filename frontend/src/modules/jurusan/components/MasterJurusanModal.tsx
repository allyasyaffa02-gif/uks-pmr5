import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, GraduationCap, X } from "lucide-react";
import {
  CreateJurusanInput,
  JurusanItem,
} from "../types/jurusan";

interface MasterJurusanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJurusanInput) => Promise<void>;
  initialData?: JurusanItem | null;
  isLoading?: boolean;
}

export const MasterJurusanModal: React.FC<MasterJurusanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJurusanInput>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? "",
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateJurusanInput) => {
    await onSubmit({ name: data.name.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg border border-black/5 overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-surface-container-high/60 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/15 flex items-center justify-center text-primary">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {isEdit ? "Edit Jurusan" : "Tambah Jurusan"}
              </h3>
              <p className="font-body-sm text-body-sm text-secondary">
                {isEdit
                  ? "Perbarui nama jurusan"
                  : "Tambahkan jurusan baru pada master data"}
              </p>
            </div>
          </div>
          <button
            type="button"
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
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold">
              <GraduationCap size={14} className="text-primary" />
              Nama Jurusan
            </label>
            <input
              type="text"
              placeholder="Contoh: IPA, IPS, Bahasa, Keperawatan"
              className={`w-full px-3.5 py-2.5 rounded-xl border font-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                errors.name
                  ? "border-error focus:border-error"
                  : "border-black/10 focus:border-primary"
              }`}
              {...register("name", {
                required: "Nama jurusan wajib diisi",
                maxLength: {
                  value: 20,
                  message: "Maksimal 20 karakter",
                },
              })}
            />
            {errors.name && (
              <span className="flex items-center gap-1 text-label-sm text-error">
                <AlertCircle size={12} /> {errors.name.message}
              </span>
            )}
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
                <span>{isEdit ? "Simpan Perubahan" : "Tambah Jurusan"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};