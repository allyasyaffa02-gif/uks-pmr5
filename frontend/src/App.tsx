import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/ui/Header";
import { StatsCard } from "./components/ui/StatsCard";
import { NavigationTabs, TabType } from "./components/ui/NavigationTabs";
import { CatatBaruPage } from "./modules/uks/pages/CatatBaruPage";
import { DataSpreadsheetPage } from "./modules/uks/pages/DataSpreadsheetPage";
import { RekapKelasPage } from "./modules/uks/pages/RekapKelasPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("input");

  return (
    <div className="wrap">
      <Header />

      <StatsCard />

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        {activeTab === "input" && (
          <CatatBaruPage onSuccess={() => setActiveTab("data")} />
        )}
        {activeTab === "data" && <DataSpreadsheetPage />}
        {activeTab === "rekap" && <RekapKelasPage />}
      </main>

      <footer>
        Data tersimpan otomatis di database MySQL melalui Prisma & NestJS API.
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
