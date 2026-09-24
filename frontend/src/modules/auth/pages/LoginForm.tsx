import React, { CSSProperties, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authError";
import { FormInput } from "../../../components/ui/FormInput";
import { Banner, bannerStyle } from "./LoginPage";
import { Icon } from "../../../components/ui/Icons";

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginForm: React.FC<{ onForgot: () => void }> = ({ onForgot }) => {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setBanner(null);
    setSubmitting(true);
    try {
      await login(data.username, data.password);
    } catch (err) {
      setBanner({
        kind: "error",
        icon: "error",
        text: getAuthErrorMessage(
          err,
          "Kombinasi akun salah. Silakan periksa kembali kredensial Anda.",
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5 text-on-surface">
        <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
          <LogIn size={18} />
        </div>
        <h2 className="text-headline-lg text-on-surface">Login</h2>
      </div>
      <p className="text-body-md text-secondary">
        Masuk dengan username dan password Anda.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <FormInput
            label="Username"
            icon={User}
            placeholder="Contoh: admin"
            autoComplete="username"
            registration={register("username", {
              required: "Username wajib diisi",
            })}
            error={errors.username}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FormInput
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            registration={register("password", {
              required: "Password wajib diisi",
            })}
            error={errors.password}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`group w-full mt-2 bg-primary-container hover:bg-primary text-on-primary text-label-lg py-3.5 px-6 rounded-lg shadow-lg shadow-primary-container/30 hover:shadow-primary-container/40 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            submitting ? "opacity-80 cursor-wait" : ""
          }`}
        >
          <LogIn size={18} />
          <span>{submitting ? "Memeriksa..." : "Masuk"}</span>
        </button>

        {/* Reset link */}
        <div className="flex flex-col items-center justify-center pt-2">
          <a
            href="#reset-password"
            onClick={onForgot}
            className="text-label-md text-secondary hover:text-primary transition-colors text-center py-1 px-2 rounded hover:bg-surface-container-low"
          >
            Lupa password?{" "}
            <span className="font-semibold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">
              Reset di sini
            </span>
          </a>
        </div>
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
