import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, Lock, Save, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authError";
import { FormInput } from "../../../components/ui/FormInput";

interface ChangeFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordPage: React.FC = () => {
  const { user, changePassword } = useAuth();
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangeFormValues>({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ChangeFormValues) => {
    setServerError("");
    setServerSuccess("");
    setSubmitting(true);
    try {
      const msg = await changePassword(data.oldPassword, data.newPassword);
      setServerSuccess(msg || "Password berhasil diganti");
      reset();
    } catch (err) {
      setServerError(getAuthErrorMessage(err, "Ganti password gagal"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Ganti password
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-1">
              Login sebagai
              <span className="font-semibold text-on-surface bg-surface-container px-2 py-0.5 rounded-md">
                {user?.username} {user?.isAdmin ? "(admin)" : ""}
              </span>
              — masukkan password lama lalu buat password baru untuk keamanan
              akun petugas PMR.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-full bg-surface-container-low text-secondary">
          <span className="material-symbols-outlined text-[18px] text-primary">
            verified_user
          </span>
          <span className="font-label-sm text-label-sm">
            Akun Terverifikasi
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <FormInput
              label="Password lama"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              registration={register("oldPassword", {
                required: "Password lama wajib diisi",
              })}
              error={errors.oldPassword}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormInput
              label="Password baru"
              icon={KeyRound}
              type="password"
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              registration={register("newPassword", {
                required: "Password baru wajib diisi",
                minLength: { value: 6, message: "Minimal 6 karakter" },
              })}
              error={errors.newPassword}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <FormInput
            label="Konfirmasi password baru"
            icon={Shield}
            type="password"
            placeholder="Ulangi password baru"
            autoComplete="new-password"
            registration={register("confirmPassword", {
              required: "Konfirmasi password wajib diisi",
              validate: (v) =>
                v === watch("newPassword") || "Konfirmasi tidak sama",
            })}
            error={errors.confirmPassword}
          />
        </div>

        {serverError && (
          <p className="col-span-2 rounded-field border border-red-400/30 bg-red-500/10 px-3 py-2 text-[0.85rem] font-medium text-red-300">
            {serverError}
          </p>
        )}
        {serverSuccess && (
          <p className="col-span-2 rounded-field border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-[0.85rem] font-medium text-emerald-300">
            {serverSuccess}
          </p>
        )}

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-[20px] text-primary">
              security
            </span>
            <span className="font-body-sm text-body-sm">
              Sesi autentikasi aman terenkripsi 256-bit.
            </span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-semibold rounded-xl shadow-lg shadow-primary-container/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Save size={18} />
            <span>{submitting ? "Menyimpan..." : "Simpan password baru"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
