import React, { CSSProperties, useState } from "react";
import { HeartPulse, LogIn, KeyRound, ArrowLeft } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Icon } from "../../../components/ui/Icons";

export type Banner = {
  kind: "success" | "error" | "info";
  icon: string;
  text: string;
} | null;

export const bannerStyle = {
  success: { box: "bg-emerald-50 text-emerald-800", icon: "text-emerald-600" },
  error: {
    box: "bg-error-container text-on-error-container",
    icon: "text-error",
  },
  info: {
    box: "bg-surface-container-high text-on-surface",
    icon: "text-primary",
  },
} as const;

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const isLogin = mode === "login";

  const currentYear = new Date().getFullYear();

  return (
    <main className="w-full">
      <div className="flex flex-col w-full items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden select-none">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md">
            <div className="relative w-14 h-14 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-lg shadow-primary-container/25 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-container opacity-90" />
              <Icon
                name="ecg_heart"
                filled
                className="text-[30px] relative z-10"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-headline-md text-on-surface tracking-tight truncate">
                Catatan Kesehatan Siswa
              </h1>
              <p className="text-body-sm text-secondary truncate mt-0.5">
                PMR — silakan login untuk melanjutkan
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-xl flex flex-col gap-6 relative">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest/80 backdrop-blur-sm p-3.5 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <Icon name="medical_services" className="text-[20px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-sm text-secondary truncate">
                  Status UKS
                </span>
                <span className="text-label-md text-on-surface flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Siaga Piket
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest/80 backdrop-blur-sm p-3.5 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                <Icon name="schedule" className="text-[20px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-sm text-secondary truncate">
                  Jam Operasional
                </span>
                <span className="text-label-md text-on-surface font-bold truncate">
                  06:45 - 15:30
                </span>
              </div>
            </div>
          </div>

          <footer className="text-center pt-2">
            <p className="text-label-sm text-secondary/70">
              &copy;{currentYear} wtfychxx - All rights reserved
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
};
