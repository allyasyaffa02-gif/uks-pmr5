import React from "react";
import { Link, NavLink } from "react-router-dom";
import { HeartPulse, LogOut, User } from "lucide-react";
import { useAuth } from "../../modules/auth/hooks/useAuth";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-7xl mx-auto px-gutter-desktop flex items-center justify-between gap-space-md">
        <Link to="/" className="flex items-center gap-space-md group">
          <div className="w-11 h-11 rounded-lg bg-primary-fixed flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
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
        </Link>

        <div className="flex items-center gap-space-lg">
          <nav className="flex items-center gap-1 sm:gap-space-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl font-label-md text-label-md transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                    : "text-secondary hover:text-on-surface hover:bg-surface-container-low"
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">
                assignment
              </span>
              <span>Buku Registrasi</span>
            </NavLink>

            <NavLink
              to="/obat"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl font-label-md text-label-md transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
                    : "text-secondary hover:text-on-surface hover:bg-surface-container-low"
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">
                medication
              </span>
              <span>Master Obat</span>
            </NavLink>
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
