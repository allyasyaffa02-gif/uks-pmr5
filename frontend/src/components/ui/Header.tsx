import React from "react";
import { HeartPulse, LogOut, User } from "lucide-react";
import { useAuth } from "../../modules/auth/hooks/useAuth";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-gutter-desktop flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-11 h-11 rounded-lg bg-primary-fixed flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-[26px]">
              medical_services
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-tight">
              Catatan Kesehatan Siswa
            </span>
            <span className="font-label-md text-label-md text-secondary tracking-normal">
              PMR — Unit Kesehatan Sekolah (UKS)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-lg">
          <nav
            className="hidden lg:flex items-center gap-space-sm"
            data-active-classes="bg-primary-container text-on-primary-container font-semibold rounded-lg px-space-md py-space-sm"
          >
            {/* <a
              aria-current="page"
              className="transition-colors bg-primary-container text-on-primary-container font-semibold rounded-lg px-space-md py-space-sm"
              data-path="dashboard-kesehatan"
              href="#"
            >
              Buku Registrasi
            </a>
            <a
              className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="upacara-darurat"
              href="#"
            >
              Pos Upacara
            </a>
            <a
              className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="inventaris-obat"
              href="#"
            >
              Stok Obat
            </a>
            <a
              className="px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              data-path="laporan-rekam-medis"
              href="#"
            >
              Rekap Medis
            </a> */}
          </nav>

          <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              Posko Siaga UKS
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-sm bg-surface-container-low px-space-sm py-1 rounded-full">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">
                    person
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold pr-space-xs hidden sm:inline-block">
                  {user.username} ({user.isAdmin ? "admin" : "user"})
                </span>
              </div>
              <button
                className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-lg text-label-lg text-secondary hover:bg-primary-fixed hover:text-primary transition-all"
                data-path="login"
                onClick={() => logout()}
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
