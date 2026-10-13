import React, { useState } from "react";
import { TabType } from "../../../components/ui/NavigationTabs";
import { MainLayout } from "../../../components/ui/PageLayout";
import { CatatBaruPage } from "./CatatBaruPage";
import { DataSpreadsheetPage } from "./DataSpreadsheetPage";
import { RekapKelasPage } from "./RekapKelasPage";
import { ChangePasswordPage } from "../../auth/pages/ChangePasswordPage";

export const UksMainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("input");

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
