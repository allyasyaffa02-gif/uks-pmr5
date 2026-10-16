import { apiClient } from "../../../utils/apiClient";
import {
  AuthMessageResponse,
  ChangePasswordInput,
  LoginInput,
  LoginResponse,
  MeResponse,
  RefreshResponse,
  ResetPasswordInput,
} from "../types/auth";

export const loginApi = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

/**
 * Minta access token baru memakai refresh token (cookie httpOnly).
 * Endpoint ini juga memutar (rotate) refresh token dan menggeser masa berlaku
 * sesi, jadi selama user masih aktif sesi tidak pernah mati.
 */
export const refreshApi = async (): Promise<RefreshResponse> => {
  const response = await apiClient.post<RefreshResponse>("/auth/refresh");
  return response.data;
};

/** Profil user yang sedang login; butuh Bearer token. */
export const getMeApi = async (): Promise<MeResponse> => {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data;
};

export const logoutApi = async (): Promise<AuthMessageResponse> => {
  const response = await apiClient.post<AuthMessageResponse>("/auth/logout");
  return response.data;
};

export const resetPasswordApi = async (
  data: ResetPasswordInput,
): Promise<AuthMessageResponse> => {
  const response = await apiClient.post<AuthMessageResponse>(
    "/auth/reset-password",
    data,
  );
  return response.data;
};

/** Ganti password; user diambil dari token, jadi username tidak dikirim. */
export const changePasswordApi = async (
  data: ChangePasswordInput,
): Promise<
  AuthMessageResponse & { accessToken?: string; expiresIn?: number }
> => {
  const response = await apiClient.post<
    AuthMessageResponse & { accessToken?: string; expiresIn?: number }
  >("/auth/change-password", data);
  return response.data;
};
