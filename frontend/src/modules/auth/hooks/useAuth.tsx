import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  changePasswordApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
} from "../services/auth.service";
import type { AuthUser } from "../types/auth";

const STORAGE_KEY = "uks_auth_user";

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed.username !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  resetPassword: (username: string, newPassword: string) => Promise<string>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginApi({
      username: username.trim(),
      password,
    });
    setUser(res.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* backend stateless — abaikan error jaringan saat logout */
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const resetPassword = useCallback(
    async (username: string, newPassword: string) => {
      const res = await resetPasswordApi({
        username: username.trim(),
        newPassword,
      });
      return res.message;
    },
    [],
  );

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      if (!user) throw new Error("Anda belum login");
      const res = await changePasswordApi({
        username: user.username,
        oldPassword,
        newPassword,
      });
      return res.message;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      login,
      logout,
      resetPassword,
      changePassword,
    }),
    [user, login, logout, resetPassword, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
