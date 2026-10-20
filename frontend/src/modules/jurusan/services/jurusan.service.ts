import { ApiResponse } from "../../../types/api";
import { apiClient } from "../../../utils/apiClient";
import {
  CreateJurusanInput,
  JurusanItem,
  UpdateJurusanInput,
} from "../types/jurusan";

export const getJurusanListApi = async (
  params?: { search?: string },
): Promise<ApiResponse<JurusanItem[]>> => {
  const response = await apiClient.get<ApiResponse<JurusanItem[]>>(
    "/jurusan",
    { params },
  );

  return response.data;
};

export const createJurusanApi = async (
  data: CreateJurusanInput,
): Promise<ApiResponse<JurusanItem>> => {
  const response = await apiClient.post<ApiResponse<JurusanItem>>(
    "/jurusan",
    data,
  );

  return response.data;
};

export const updateJurusanApi = async (
  id: number,
  data: UpdateJurusanInput,
): Promise<ApiResponse<JurusanItem>> => {
  const response = await apiClient.put<ApiResponse<JurusanItem>>(
    `/jurusan/${id}`,
    data,
  );

  return response.data;
};

export const deleteJurusanApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/jurusan/${id}`,
  );

  return {
    success: true,
    message: response.data?.message || "Jurusan berhasil dihapus",
  };
};