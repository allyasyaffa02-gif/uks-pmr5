import { ApiResponse } from "../../../types/api";
import { apiClient } from "../../../utils/apiClient";
import {
  ObatItem,
  CreateObatInput,
  UpdateObatInput,
  ObatFilterParams,
  SatuanObatItem,
  ImportObatResult,
  ObatStatistic,
  ObatStatisticResponse,
} from "../types/obat";

export const getSatuanObatApi = async (): Promise<
  ApiResponse<SatuanObatItem[]>
> => {
  const response =
    await apiClient.get<ApiResponse<SatuanObatItem[]>>("/obat/satuan");

  return response.data;
};

export const getObatListApi = async (
  params?: ObatFilterParams,
): Promise<ApiResponse<ObatItem[]>> => {
  const response = await apiClient.get<ApiResponse<ObatItem[]>>("/obat", {
    params,
  });

  return response.data;
};

export const getObatStatisticApi = async (): Promise<ObatStatistic> => {
  const response =
    await apiClient.get<ApiResponse<ObatStatisticResponse>>("/obat/statistic");

  const data = response.data?.data ?? response.data;

  return {
    hampirHabis: data.lowStock,
    hampirKadaluarsa: data.expiringSoon,
    kadaluarsa: data.expired,
  };
};

export const createObatApi = async (
  data: CreateObatInput,
): Promise<ApiResponse<ObatItem>> => {
  const response = await apiClient.post<ApiResponse<ObatItem>>("/obat", data);

  return response.data;
};

export const updateObatApi = async (
  id: number,
  data: UpdateObatInput,
): Promise<ApiResponse<ObatItem>> => {
  const response = await apiClient.put<ApiResponse<ObatItem>>(
    `/obat/${id}`,
    data,
  );
  return response.data;
};

export const deleteObatApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/obat/${id}`);

  return {
    success: true,
    message: response.data?.message || "Obat berhasil dihapus",
  };
};

/** Unduh template import obat (.xlsx) dari backend sebagai Blob. */
export const downloadObatTemplateApi = async (): Promise<Blob> => {
  const response = await apiClient.get<Blob>("/obat/template", {
    responseType: "blob",
    timeout: 30000,
  });
  return response.data;
};

/** Unggah file Excel untuk import obat; hasil per baris dikembalikan backend. */
export const importObatApi = async (
  file: File,
): Promise<ApiResponse<ImportObatResult>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<ImportObatResult>>(
    "/obat/import",
    formData,
    {
      // proses import bisa lebih lama dari request biasa
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    },
  );

  return response.data;
};
