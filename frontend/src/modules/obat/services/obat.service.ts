import { apiClient } from "../../../utils/apiClient";
import {
  ObatItem,
  CreateObatInput,
  UpdateObatInput,
  ObatFilterParams,
  SatuanObatItem,
  ImportObatResult,
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

/** Unduh template import obat (.xlsx) dari backend sebagai Blob. */
export const downloadObatTemplateApi = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get<Blob>("/obat/template", {
      responseType: "blob",
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error("Gagal mengunduh template import obat", error);
    throw error;
  }
};

/** Unggah file Excel untuk import obat; hasil per baris dikembalikan backend. */
export const importObatApi = async (file: File): Promise<ImportObatResult> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post<any>("/obat/import", formData, {
      // proses import bisa lebih lama dari request biasa
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Gagal mengimport data obat", error);
    throw error;
  }
};
