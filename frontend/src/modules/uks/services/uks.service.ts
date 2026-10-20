import { ApiResponse } from "../../../types/api";
import { unwrapApiData } from "../../../utils/apiData";
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
): Promise<KasusItem[]> => {
  const response = await apiClient.get<ApiResponse<KasusItem[]> | KasusItem[]>(
    "/uks/kasus",
    { params },
  );

  return unwrapApiData<KasusItem[]>(response.data);
};

export const createKasusApi = async (
  data: CreateKasusInput,
): Promise<KasusItem> => {
  const response = await apiClient.post<ApiResponse<KasusItem> | KasusItem>(
    "/uks/kasus",
    data,
  );

  return unwrapApiData<KasusItem>(response.data);
};

export const deleteKasusApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<
    ApiResponse<null> | { success: boolean; message: string }
  >(`/uks/kasus/${id}`);

  return {
    success: true,
    message: response.data?.message || "Kasus berhasil dihapus",
  };
};

export const getRekapApi = async (): Promise<RekapKelasItem[]> => {
  const response = await apiClient.get<
    ApiResponse<RekapKelasItem[]> | RekapKelasItem[]
  >("/uks/rekap");

  return unwrapApiData<RekapKelasItem[]>(response.data);
};

export const getStatsApi = async (): Promise<StatsSummary> => {
  const response = await apiClient.get<ApiResponse<StatsSummary> | StatsSummary>(
    "/uks/stats",
  );

  return unwrapApiData<StatsSummary>(response.data);
};

export const getKategoriApi = async (): Promise<KategoriItem[]> => {
  const response = await apiClient.get<
    ApiResponse<KategoriItem[]> | KategoriItem[]
  >("/uks/kategori");

  return unwrapApiData<KategoriItem[]>(response.data);
};
