import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { UksMainPage } from "../modules/uks/pages/UksMainPage";
import { MasterObatPage } from "../modules/obat/pages/MasterObatPage";
import { MasterJurusanPage } from "../modules/jurusan/pages/MasterJurusanPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route 1: Halaman Login (Publik) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <div className="bg-surface font-sans text-body-md text-on-surface antialiased min-h-screen flex items-center justify-center">
              <LoginPage />
            </div>
          </PublicOnlyRoute>
        }
      />

      {/* Route 2: Halaman Utama UKS / MainLayout (Telah Di-autentikasi) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UksMainPage />
          </ProtectedRoute>
        }
      />

      {/* Route 3: Halaman Master Obat (Telah Di-autentikasi) */}
      <Route
        path="/obat"
        element={
          <ProtectedRoute>
            <MasterObatPage />
          </ProtectedRoute>
        }
      />

      {/* Route 4: Halaman Master Jurusan (Telah Di-autentikasi) */}
      <Route
        path="/jurusan"
        element={
          <ProtectedRoute>
            <MasterJurusanPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route jika URL tidak dikenali */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
