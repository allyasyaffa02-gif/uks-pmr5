import { apiClient } from "../../../utils/apiClient";
import {
  ObatItem,
  CreateObatInput,
  UpdateObatInput,
  ObatFilterParams,
  SatuanObatItem,
} from "../types/obat";

export const getSatuanObatApi = async (): Promise<SatuanObatItem[]> => {
  try {
    const response = await apiClient.get<any>("/obat/satuan");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mendapatkan daftar satuan obat dari backend", error);
    return [];
  }
};

export const getObatListApi = async (
  params?: ObatFilterParams,
): Promise<ObatItem[]> => {
  try {
    const response = await apiClient.get<any>("/obat", { params });
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mendapatkan daftar obat dari backend", error);
    return [];
  }
};

export const createObatApi = async (
  data: CreateObatInput,
): Promise<ObatItem> => {
  try {
    const response = await apiClient.post<any>("/obat", data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Gagal menambahkan obat ke backend", error);
    throw error;
  }
};

export const updateObatApi = async (
  id: number,
  data: UpdateObatInput,
): Promise<ObatItem> => {
  try {
    const response = await apiClient.put<any>(`/obat/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Gagal mengupdate obat di backend", error);
    throw error;
  }
};

export const deleteObatApi = async (
  id: number,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete<any>(`/obat/${id}`);
    return {
      success: true,
      message: response.data?.message || "Obat berhasil dihapus",
    };
  } catch (error) {
    console.error("Gagal menghapus obat dari backend", error);
    throw error;
  }
};

