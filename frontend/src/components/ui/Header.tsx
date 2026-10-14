import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks/useAuth";

/**
 * Header aplikasi.
 *
 * Tata letak responsif:
 * - < lg : dua baris. Baris 1 = identitas aplikasi + akun (avatar, keluar),
 *          baris 2 = navigasi utama. `flex-wrap` + `order` dipakai supaya
 *          elemen navigasi tetap dirender sekali namun turun ke baris kedua
 *          pada layar sempit, sehingga tidak ada teks yang terpotong.
 * - >= lg: satu baris (identitas kiri, navigasi + akun kanan).
 *
 * Header memakai `sticky` (bukan `fixed`) agar tingginya ikut alur dokumen,
 * jadi halaman tidak butuh padding-top ajaib dan tidak ada konten tertutup.
 */
export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 font-label-md text-label-md transition-all lg:flex-none ${
      isActive
        ? "bg-primary-container text-on-primary-container font-semibold shadow-xs"
        : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-2 px-gutter lg:h-20 lg:flex-nowrap lg:gap-x-space-md lg:px-gutter-desktop">
        {/* Identitas aplikasi */}
        <Link
          to="/"
          className="group order-1 flex h-16 min-w-0 flex-1 basis-0 items-center gap-2 lg:mr-auto lg:h-20 lg:flex-none lg:gap-space-md"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed shadow-sm transition-transform group-hover:scale-105 lg:h-11 lg:w-11">
            <span className="material-symbols-outlined text-[22px] text-primary lg:text-[26px]">
              medical_services
            </span>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="break-words font-semibold text-[15px] leading-tight tracking-tight text-on-surface sm:truncate sm:text-headline-md">
              Catatan Kesehatan Siswa
            </span>
            <span className="hidden truncate font-label-md text-label-md tracking-normal text-secondary sm:block">
              PMR — Unit Kesehatan Sekolah (UKS)
            </span>
          </div>
        </Link>

        {/* Akun: indikator posko, avatar, tombol keluar */}
        <div className="order-2 flex h-16 shrink-0 items-center gap-1 lg:order-3 lg:h-20 lg:gap-space-lg">
          <div className="hidden items-center gap-space-xs rounded-full bg-surface-container-low px-space-md py-space-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)] md:flex">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary"></span>
            <span className="font-label-sm text-label-sm font-semibold text-secondary">
              Posko Siaga UKS
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-1 lg:gap-space-md">
              <div className="flex items-center gap-space-sm rounded-full bg-surface-container-low px-space-sm py-1">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-on-primary">
                    person
                  </span>
                </div>
                <span className="hidden pr-space-xs font-label-md text-label-md font-semibold text-on-surface lg:inline-block">
                  {user.username} ({user.isAdmin ? "admin" : "user"})
                </span>
              </div>
              <button
                type="button"
                aria-label="Keluar"
                title="Keluar"
                className="flex items-center gap-space-xs rounded-lg px-space-sm py-space-sm font-label-lg text-label-lg text-secondary transition-all hover:bg-primary-fixed hover:text-primary lg:px-space-md"
                data-path="login"
                onClick={() => logout()}
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <span className="hidden lg:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigasi utama: baris kedua pada layar < lg */}
        <nav className="order-3 flex h-12 w-full items-center gap-1 border-t border-surface-container-low lg:order-2 lg:h-20 lg:w-auto lg:gap-space-sm lg:border-t-0">
          <NavLink to="/" end className={navLinkClass}>
            <span className="material-symbols-outlined text-[18px]">
              assignment
            </span>
            <span>Buku Registrasi</span>
          </NavLink>

          <NavLink to="/obat" className={navLinkClass}>
            <span className="material-symbols-outlined text-[18px]">
              medication
            </span>
            <span>Master Obat</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
