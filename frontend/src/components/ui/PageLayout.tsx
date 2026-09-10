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
  return (
    <div className="flex w-full min-w-0 max-w-[1020px] flex-col gap-6">
      {/* Header Utama Aplikasi */}
      <Header />

      {/* Ringkasan Statistik */}
      <StatsCard />

      {/* Navigasi Tab */}
      <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />

      {/* Kontainer Utama Konten Page: Konsisten lebar, padding, latar & efek blur */}
      <main className="w-full min-w-0 max-w-full overflow-hidden rounded-card border border-line bg-glass p-4 sm:p-6 shadow-card-lg backdrop-blur-[16px]">
        {children}
      </main>

      {/* Footer Aplikasi */}
      <footer className="px-3 py-3 text-center text-[0.8rem] text-ink-dim">
        Data tersimpan otomatis di database MySQL melalui Prisma & NestJS API.
      </footer>
    </div>
  );
};

