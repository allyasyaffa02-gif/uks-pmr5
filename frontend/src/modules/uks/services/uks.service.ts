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
  const response = await apiClient.get<KasusItem[]>("/uks/kasus", { params });
  return response.data;
};

export const createKasusApi = async (
  data: CreateKasusInput,
): Promise<KasusItem> => {
  const response = await apiClient.post<KasusItem>("/uks/kasus", data);
  return response.data;
};

export const deleteKasusApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/uks/kasus/${id}`);
  return response.data;
};

export const getRekapApi = async (): Promise<RekapKelasItem[]> => {
  const response = await apiClient.get<RekapKelasItem[]>("/uks/rekap");
  return response.data;
};

export const getStatsApi = async (): Promise<StatsSummary> => {
  const response = await apiClient.get<StatsSummary>("/uks/stats");
  return response.data;
};

export const getKategoriApi = async (): Promise<KategoriItem[]> => {
  const response = await apiClient.get<KategoriItem[]>("/uks/kategori");
  return response.data;
};
