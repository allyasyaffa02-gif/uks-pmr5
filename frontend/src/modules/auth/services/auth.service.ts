import { apiClient } from "../../../utils/apiClient";
import {
  AuthMessageResponse,
  ChangePasswordInput,
  LoginInput,
  LoginResponse,
  ResetPasswordInput,
} from "../types/auth";

export const loginApi = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
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

export const changePasswordApi = async (
  data: ChangePasswordInput,
): Promise<AuthMessageResponse> => {
  const response = await apiClient.post<AuthMessageResponse>(
    "/auth/change-password",
    data,
  );
  return response.data;
};
