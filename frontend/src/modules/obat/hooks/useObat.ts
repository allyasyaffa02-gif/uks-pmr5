import { useQuery } from "@tanstack/react-query";
import {
  createObatApi,
  deleteObatApi,
  getObatListApi,
  importObatApi,
  ObatListApiResponse,
  updateObatApi,
} from "../services/obat.service";
import {
  CreateObatInput,
  ObatFilterParams,
  ObatSummary,
  UpdateObatInput,
} from "../types/obat";
import { useToastMutation } from "../../../hooks/useToastMutation";

export const OBAT_QUERY_KEY = ["master-obat"];

export function useObat(filter?: ObatFilterParams) {
  const query = useQuery<ObatListApiResponse>({
    queryKey: [...OBAT_QUERY_KEY, filter?.search, filter?.status],
    queryFn: () => getObatListApi(filter),
  });

  const createMutation = useToastMutation({
    mutationFn: (data: CreateObatInput) => createObatApi(data),
    successMessage: "Obat berhasil ditambahkan",
    invalidateQueries: OBAT_QUERY_KEY,
  });

  const updateMutation = useToastMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObatInput }) =>
      updateObatApi(id, data),
    successMessage: "Obat berhasil diperbarui",
    invalidateQueries: OBAT_QUERY_KEY,
  });

  const deleteMutation = useToastMutation({
    mutationFn: (id: number) => deleteObatApi(id),
    successMessage: "Obat berhasil dihapus",
    invalidateQueries: OBAT_QUERY_KEY,
  });

  // Import Excel: hasil per baris dikembalikan ke pemanggil untuk ditampilkan,
  // sedangkan daftar obat di-refresh bila ada baris yang berhasil disimpan.
  // Karena itu tidak ada successMessage di sini; hanya error yang memunculkan toast.
  const importMutation = useToastMutation({
    mutationFn: (file: File) => importObatApi(file),
    invalidateQueries: OBAT_QUERY_KEY,
  });

  const obatList = query.data?.data ?? [];
  const obatSummary = query.data?.statistic;

  // Calculate summaries across all items
  const summary: ObatSummary = {
    totalJenis: obatSummary?.all ?? 0,
    totalStok: obatSummary?.totalStock ?? 0,
    stokMenipis: obatSummary?.lowStock ?? 0,
    mendekatiKadaluarsa: obatSummary?.expiringSoon ?? 0,
    kadaluarsa: obatSummary?.expired ?? 0,
  };

  return {
    obatList,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    summary,
    createObat: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateObat: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteObat: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    importObat: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
  };
}
