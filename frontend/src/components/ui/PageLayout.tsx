import React from "react";
import { Header } from "./Header";
import { StatsCard } from "./StatsCard";
import { NavigationTabs, TabType } from "./NavigationTabs";

interface MainLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      {/* Header Utama Aplikasi */}
      <Header />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-gutter-desktop py-space-lg space-y-space-lg">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Ringkasan Statistik */}
            <StatsCard />
          </section>

          <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />

          <section>{children}</section>

          {/* Contextual Information Card */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  health_and_safety
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-headline-md text-headline-md text-on-surface">
                  Protokol Penanganan Cepat Posko PMR
                </span>
                <p className="font-body-md text-body-md text-secondary">
                  Setiap siswa yang dirawat lebih dari 60 menit atau mengalami
                  penurunan kesadaran wajib dirujuk ke Puskesmas mitra dan
                  segera menghubungi wali kelas.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                  Status Sinkronisasi
                </span>
                <span className="font-headline-md text-headline-md text-on-surface flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  MySQL Connected
                </span>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-secondary block">
                  Terakhir Disimpan
                </span>
                <span className="font-label-md text-label-md font-semibold text-on-surface">
                  -
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.03)] py-space-md">
        <div className="max-w-7xl mx-auto px-gutter-desktop flex flex-col sm:flex-row items-center justify-between gap-space-xs text-center sm:text-left">
          <p className="font-body-sm text-body-sm text-secondary">
            Data tersimpan otomatis di database MySQL melalui Prisma &amp;
            NestJS API.
          </p>
          <p className="font-body-sm text-body-sm text-secondary">
            © {currentYear} wtfychxx - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
