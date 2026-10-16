import { ApiResponse } from "../../../types/api";
import { apiClient } from "../../../utils/apiClient";
import {
  KasusItem,
  CreateKasusInput,
  KasusFilterParams,
  RekapKelasItem,
  StatsSummary,
  KategoriItem,
} from "../types/uks";

export const getKasusApi = async (
  params?: KasusFilterParams,
): Promise<ApiResponse<KasusItem[]>> => {
  const response = await apiClient.get<ApiResponse<KasusItem[]>>("/uks/kasus", {
    params,
  });

  return response.data;
};

export const createKasusApi = async (
  data: CreateKasusInput,
): Promise<ApiResponse<KasusItem>> => {
  const response = await apiClient.post<ApiResponse<KasusItem>>(
    "/uks/kasus",
    data,
  );
  return response.data;
};

export const deleteKasusApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/uks/kasus/${id}`,
  );
  return { success: true, message: response.data.message };
};

export const getRekapApi = async (): Promise<ApiResponse<RekapKelasItem[]>> => {
  const response =
    await apiClient.get<ApiResponse<RekapKelasItem[]>>("/uks/rekap");

  return response.data;
};

export const getStatsApi = async (): Promise<ApiResponse<StatsSummary>> => {
  const response = await apiClient.get<ApiResponse<StatsSummary>>("/uks/stats");

  return response.data;
};

export const getKategoriApi = async (): Promise<
  ApiResponse<KategoriItem[]>
> => {
  const response =
    await apiClient.get<ApiResponse<KategoriItem[]>>("/uks/kategori");

  return response.data;
};
