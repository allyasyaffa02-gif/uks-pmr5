import React, { useState } from "react";
import { HeartPulse, LogIn, KeyRound, ArrowLeft } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const isLogin = mode === "login";

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex w-full min-w-0 max-w-[440px] flex-col gap-6">
      <header className="flex items-center gap-4 rounded-card border border-line bg-glass p-6 shadow-card backdrop-blur-[16px]">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark text-white shadow-icon">
          <HeartPulse size={32} />
        </div>
        <div>
          <h1 className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-[1.65rem] font-extrabold tracking-[-0.02em] text-transparent">
            Catatan Kesehatan Siswa
          </h1>
          <p className="text-[0.9rem] font-medium text-ink-muted">
            PMR — silakan login untuk melanjutkan
          </p>
        </div>
      </header>

      <main className="w-full rounded-card border border-line bg-glass p-6 shadow-card-lg backdrop-blur-[16px]">
        <h2 className="mb-1 flex items-center gap-2 text-[1.25rem] font-bold text-ink">
          {isLogin ? <LogIn size={20} /> : <KeyRound size={20} />}
          {isLogin ? "Login" : "Lupa password"}
        </h2>
        <p className="mb-5 text-[0.85rem] text-ink-muted">
          {isLogin
            ? "Masuk dengan username dan password Anda."
            : "Masukkan username lalu buat password baru."}
        </p>

        {isLogin ? (
          <LoginForm onForgot={() => setMode("forgot")} />
        ) : (
          <>
            <ForgotPasswordForm />
            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 bg-transparent px-2 py-1 text-[0.85rem] font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} /> Kembali ke login
            </button>
          </>
        )}
      </main>

      <footer className="px-3 py-1 text-center text-[0.8rem] text-ink-dim">
        &copy;{currentYear} wtfychxx - All rights reserved
      </footer>
    </div>
  );
};
