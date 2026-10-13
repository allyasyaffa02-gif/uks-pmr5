import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth/hooks/useAuth";

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
