import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn, isAuthReady } = useAuth();

  // Hindari kedipan form login sebelum sesi selesai dipulihkan.
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

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
