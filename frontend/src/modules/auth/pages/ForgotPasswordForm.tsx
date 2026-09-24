import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, KeyRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authError";
import { FormInput } from "../../../components/ui/FormInput";
import { Banner, bannerStyle } from "./LoginPage";
import { Icon } from "../../../components/ui/Icons";

interface ResetFormValues {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export const ForgotPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetFormValues>({
    defaultValues: { username: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setBanner(null);
    setSubmitting(true);

    try {
      const msg = await resetPassword(data.username, data.newPassword);
      setBanner({
        kind: "success",
        icon: "check_circle",
        text: msg || "Password berhasil direset, silakan login",
      });
      reset();
    } catch (err) {
      setBanner({
        kind: "error",
        icon: "error",
        text: getAuthErrorMessage(err, "Reset Password Gagal"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <FormInput
            label="Username"
            icon={User}
            placeholder="Username akun Anda"
            autoComplete="username"
            registration={register("username", {
              required: "Username wajib diisi",
            })}
            error={errors.username}
          />
        </div>

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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

        <button
          type="submit"
          disabled={submitting}
          className={`group w-full mt-2 bg-primary-container hover:bg-primary text-on-primary text-label-lg py-3.5 px-6 rounded-lg shadow-lg shadow-primary-container/30 hover:shadow-primary-container/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            submitting ? "opacity-80 cursor-wait" : ""
          }`}
        >
          <KeyRound size={18} />
          <span>{submitting ? "Menyimpan..." : "Reset password"}</span>
        </button>
      </form>

      {/* Status banner */}
      {banner && (
        <div
          role={banner.kind === "error" ? "alert" : "status"}
          className={`flex rounded-lg p-3.5 items-center gap-3 text-body-sm shadow-sm transition-all duration-300 ${bannerStyle[banner.kind].box}`}
        >
          <Icon
            name={banner.icon}
            className={`text-[20px] shrink-0 ${bannerStyle[banner.kind].icon}`}
          />
          <span className="flex-1">{banner.text}</span>
        </div>
      )}
    </div>
  );
};
