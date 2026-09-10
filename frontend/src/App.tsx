import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TabType } from "./components/ui/NavigationTabs";
import { MainLayout } from "./components/ui/PageLayout";
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
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "input" && (
        <CatatBaruPage onSuccess={() => setActiveTab("data")} />
      )}
      {activeTab === "data" && <DataSpreadsheetPage />}
      {activeTab === "rekap" && <RekapKelasPage />}
    </MainLayout>
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

