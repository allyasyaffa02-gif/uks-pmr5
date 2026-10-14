import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  changePasswordApi,
  getMeApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
} from "../services/auth.service";
import { UNAUTHORIZED_EVENT } from "../../../utils/apiClient";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../../../utils/tokenStorage";
import type { AuthUser } from "../types/auth";

const STORAGE_KEY = "uks_auth_user";

/**
 * Profil user disimpan di localStorage hanya sebagai data tampilan (username,
 * role) supaya header tidak berkedip saat halaman dimuat ulang. Sumber
 * kebenaran tetap server: token diverifikasi lewat GET /auth/me sebelum rute
 * privat dirender, dan token tersebut tidak pernah bisa dibaca JavaScript.
 */
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

function storeUser(user: AuthUser | null): void {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage bisa diblokir (mode privat); abaikan, state tetap di memori
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** false selama pemulihan sesi awal; rute privat menunggu nilai ini */
  isAuthReady: boolean;
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
  const [isAuthReady, setIsAuthReady] = useState(false);

  /**
   * Pulihkan sesi saat aplikasi dibuka: kalau access token sudah tidak ada
   * (mis. halaman di-reload setelah token habis), panggil /auth/me - interceptor
   * axios otomatis memakai refresh token di cookie untuk mendapat token baru.
   */
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!getAccessToken() && !loadStoredUser()) {
        if (!cancelled) setIsAuthReady(true);
        return;
      }

      try {
        const response = await getMeApi();
        if (cancelled) return;

        setUser(response.user);
        storeUser(response.user);
      } catch {
        if (cancelled) return;

        // refresh token sudah tidak berlaku (mis. lewat 3 hari tanpa aktivitas)
        clearAccessToken();
        setUser(null);
        storeUser(null);
      } finally {
        if (!cancelled) setIsAuthReady(true);
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /** Interceptor axios memberi tahu ketika sesi benar-benar berakhir. */
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      storeUser(null);
      setIsAuthReady(true);
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginApi({
      username: username.trim(),
      password,
    });

    setAccessToken(res.accessToken, res.expiresIn);
    setUser(res.user);
    storeUser(res.user);
    setIsAuthReady(true);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      // backend mencabut sesi di database + menghapus cookie refresh token
      await logoutApi();
    } catch {
      /* jaringan bermasalah: sesi lokal tetap dibersihkan di bawah */
    }

    clearAccessToken();
    setUser(null);
    storeUser(null);
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

      // username tidak dikirim: backend memakai identitas dari Bearer token
      const res = await changePasswordApi({ oldPassword, newPassword });

      // backend memutar token setelah password berubah; simpan yang baru
      if (res.accessToken) {
        setAccessToken(res.accessToken, res.expiresIn);
      }

      return res.message;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      isAuthReady,
      login,
      logout,
      resetPassword,
      changePassword,
    }),
    [user, isAuthReady, login, logout, resetPassword, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
};
