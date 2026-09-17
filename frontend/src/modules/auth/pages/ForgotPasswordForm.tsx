import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, KeyRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authError";
import { FormInput } from "../../../components/ui/FormInput";

interface ResetFormValues {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } =
    useForm<ResetFormValues>({
      defaultValues: { username: "", newPassword: "", confirmPassword: "" },
    });

  const onSubmit = async (data: ResetFormValues) => {
    setServerError("");
    setServerSuccess("");
    setSubmitting(true);
    try {
      const msg = await resetPassword(data.username, data.newPassword);
      setServerSuccess(msg || "Password berhasil direset, silakan login");
      reset();
    } catch (err) {
      setServerError(getAuthErrorMessage(err, "Reset password gagal"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        label="Username"
        icon={User}
        placeholder="Username akun Anda"
        autoComplete="username"
        registration={register("username", { required: "Username wajib diisi" })}
        error={errors.username}
      />
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
      <FormInput
        label="Konfirmasi password baru"
        icon={Lock}
        type="password"
        placeholder="Ulangi password baru"
        autoComplete="new-password"
        registration={register("confirmPassword", {
          required: "Konfirmasi password wajib diisi",
          validate: (v) => v === watch("newPassword") || "Konfirmasi tidak sama",
        })}
        error={errors.confirmPassword}
      />
      {serverError && (
        <p className="rounded-field border border-red-400/30 bg-red-500/10 px-3 py-2 text-[0.85rem] font-medium text-red-300">
          {serverError}
        </p>
      )}
      {serverSuccess && (
        <p className="rounded-field border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-[0.85rem] font-medium text-emerald-300">
          {serverSuccess}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-field border-none bg-gradient-to-br from-primary to-primary-deep px-6 py-3 text-[0.95rem] font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-px hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <KeyRound size={18} />
        <span>{submitting ? "Menyimpan..." : "Reset password"}</span>
      </button>
    </form>
  );
};
