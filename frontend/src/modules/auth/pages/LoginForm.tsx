import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, LogIn } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorMessage } from "../utils/authError";
import { FormInput } from "../../../components/ui/FormInput";

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginForm: React.FC<{ onForgot: () => void }> = ({ onForgot }) => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } =
    useForm<LoginFormValues>({ defaultValues: { username: "", password: "" } });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    setSubmitting(true);
    try {
      await login(data.username, data.password);
    } catch (err) {
      setServerError(getAuthErrorMessage(err, "Login gagal, coba lagi"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        label="Username"
        icon={User}
        placeholder="Contoh: admin"
        autoComplete="username"
        registration={register("username", { required: "Username wajib diisi" })}
        error={errors.username}
      />
      <FormInput
        label="Password"
        icon={Lock}
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        registration={register("password", { required: "Password wajib diisi" })}
        error={errors.password}
      />
      {serverError && (
        <p className="rounded-field border border-red-400/30 bg-red-500/10 px-3 py-2 text-[0.85rem] font-medium text-red-300">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-field border-none bg-gradient-to-br from-primary to-primary-deep px-6 py-3 text-[0.95rem] font-bold text-white shadow-glow transition-all duration-200 hover:-translate-y-px hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogIn size={18} />
        <span>{submitting ? "Memeriksa..." : "Masuk"}</span>
      </button>
      <button
        type="button"
        onClick={onForgot}
        className="cursor-pointer bg-transparent px-2 py-1 text-[0.85rem] font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        Lupa password? Reset di sini
      </button>
    </form>
  );
};
