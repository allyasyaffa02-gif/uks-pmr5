import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn, isAuthReady } = useAuth();
  const location = useLocation();

  // Tunggu pemulihan sesi (GET /auth/me) selesai supaya user yang tokennya
  // masih berlaku tidak terlempar ke /login saat halaman di-reload.
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-surface">
        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-body-sm text-body-sm text-secondary">
          Memeriksa sesi...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
