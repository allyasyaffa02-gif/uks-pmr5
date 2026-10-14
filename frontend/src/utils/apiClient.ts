import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/** Dipancarkan saat sesi benar-benar berakhir (refresh token gagal/ditolak). */
export const UNAUTHORIZED_EVENT = "uks:unauthorized";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // refresh token disimpan pada cookie httpOnly -> wajib ikut terkirim
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Client khusus /auth/refresh. Dipisah dari apiClient supaya interceptor di
 * bawah tidak ikut memprosesnya (kalau tidak, refresh yang gagal akan memicu
 * refresh lagi tanpa henti).
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/** Endpoint auth yang tidak boleh memicu percobaan refresh. */
const NO_REFRESH_URLS = ["/auth/login", "/auth/refresh", "/auth/reset-password"];

function shouldSkipRefresh(url?: string): boolean {
  if (!url) return false;
  return NO_REFRESH_URLS.some((endpoint) => url.includes(endpoint));
}

/**
 * Refresh yang sedang berjalan. Beberapa request yang gagal bersamaan (mis.
 * halaman memuat 3 query sekaligus) cukup memicu SATU refresh, sisanya
 * menunggu hasil yang sama.
 */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await refreshClient.post("/auth/refresh");
        const token: unknown = response.data?.accessToken;

        if (typeof token !== "string" || token.length === 0) return null;

        setAccessToken(token, response.data?.expiresIn);
        return token;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

/** Sesi habis: buang token lokal lalu beri tahu AuthProvider. */
function notifySessionExpired(): void {
  clearAccessToken();

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
}

// Setiap request membawa access token sebagai Bearer (inilah "Bearer Token"
// yang diminta backend; cookie hanya tempat menyimpannya).
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Access token kedaluwarsa (401) -> refresh sekali, lalu ulangi request aslinya.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !config ||
      config._retry ||
      shouldSkipRefresh(config.url)
    ) {
      return Promise.reject(error);
    }

    config._retry = true;
    const token = await refreshAccessToken();

    if (!token) {
      notifySessionExpired();
      return Promise.reject(error);
    }

    config.headers.Authorization = `Bearer ${token}`;
    return apiClient.request(config);
  },
);
