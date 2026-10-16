import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getObatListApi,
  createObatApi,
  updateObatApi,
  deleteObatApi,
  importObatApi,
  ObatListApiResponse,
} from "../services/obat.service";
import {
  ObatFilterParams,
  CreateObatInput,
  UpdateObatInput,
  ObatSummary,
} from "../types/obat";
import { handleServerErrors } from "../../../utils/apiClient";

export const OBAT_QUERY_KEY = ["master-obat"];

export function useObat(filter?: ObatFilterParams) {
  const queryClient = useQueryClient();

  const query = useQuery<ObatListApiResponse>({
    queryKey: [...OBAT_QUERY_KEY, filter?.search, filter?.status],
    queryFn: () => getObatListApi(filter),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateObatInput) => createObatApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
    onError: (error) => handleServerErrors(error),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObatInput }) =>
      updateObatApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
    onError: (error) => handleServerErrors(error),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteObatApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
    onError: (error) => handleServerErrors(error),
  });

  // Import Excel: hasil per baris dikembalikan ke pemanggil untuk ditampilkan,
  // sedangkan daftar obat di-refresh bila ada baris yang berhasil disimpan.
  const importMutation = useMutation({
    mutationFn: (file: File) => importObatApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
    onError: (error) => handleServerErrors(error),
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
