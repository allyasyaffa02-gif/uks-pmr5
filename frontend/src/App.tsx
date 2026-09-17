import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TabType } from "./components/ui/NavigationTabs";
import { MainLayout } from "./components/ui/PageLayout";
import { CatatBaruPage } from "./modules/uks/pages/CatatBaruPage";
import { DataSpreadsheetPage } from "./modules/uks/pages/DataSpreadsheetPage";
import { RekapKelasPage } from "./modules/uks/pages/RekapKelasPage";
import { AuthProvider, useAuth } from "./modules/auth/hooks/useAuth";
import { LoginPage } from "./modules/auth/pages/LoginPage";
import { ChangePasswordPage } from "./modules/auth/pages/ChangePasswordPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppContent: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("input");

  // Belum login -> hanya tampilkan halaman login (termasuk lupa password).
  if (!isLoggedIn) {
    return (
      <div className="flex w-full min-w-0 max-w-[1020px] justify-center">
        <LoginPage />
      </div>
    );
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "input" && (
        <CatatBaruPage onSuccess={() => setActiveTab("data")} />
      )}
      {activeTab === "data" && <DataSpreadsheetPage />}
      {activeTab === "rekap" && <RekapKelasPage />}
      {activeTab === "password" && <ChangePasswordPage />}
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

