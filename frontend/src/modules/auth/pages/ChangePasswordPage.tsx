import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Save } from "lucide-react";
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
  const { register, handleSubmit, watch, reset, formState: { errors } } =
    useForm<ChangeFormValues>({
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
    <div>
      <h2 className="mb-1 flex items-center gap-3 text-[1.25rem] font-bold text-ink">
        Ganti password
      </h2>
      <p className="mb-5 text-[0.85rem] text-ink-muted">
        Login sebagai <span className="font-bold text-ink">{user?.username}</span>
        {user?.isAdmin ? " (admin)" : ""} — masukkan password lama lalu buat
        password baru.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-6xl grid-cols-2 gap-[18px]"
      >
        <div className="col-span-2 sm:col-span-1">
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
        <div className="col-span-2 sm:col-span-1">
          <FormInput
            label="Password baru"
            icon={Lock}
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
        <div className="col-span-2">
          <FormInput
            label="Konfirmasi password baru"
            icon={Lock}
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
        <div className="col-span-2 mt-2.5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex cursor-pointer items-center gap-2 rounded-field border-none bg-gradient-to-br from-primary to-primary-deep px-6 py-3 text-[0.95rem] font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-px hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            <span>{submitting ? "Menyimpan..." : "Simpan password baru"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
