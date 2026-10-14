import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getObatListApi,
  createObatApi,
  updateObatApi,
  deleteObatApi,
  importObatApi,
} from "../services/obat.service";
import {
  ObatFilterParams,
  CreateObatInput,
  UpdateObatInput,
  ObatItem,
  ObatSummary,
} from "../types/obat";

export const OBAT_QUERY_KEY = ["master-obat"];

export function useObat(filter?: ObatFilterParams) {
  const queryClient = useQueryClient();

  const query = useQuery<ObatItem[]>({
    queryKey: [...OBAT_QUERY_KEY, filter?.search, filter?.status],
    queryFn: () => getObatListApi(filter),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateObatInput) => createObatApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateObatInput }) =>
      updateObatApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteObatApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
  });

  // Import Excel: hasil per baris dikembalikan ke pemanggil untuk ditampilkan,
  // sedangkan daftar obat di-refresh bila ada baris yang berhasil disimpan.
  const importMutation = useMutation({
    mutationFn: (file: File) => importObatApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBAT_QUERY_KEY });
    },
  });

  const obatList = query.data || [];

  // Calculate summaries across all items
  const summary: ObatSummary = {
    totalJenis: obatList.length,
    totalStok: obatList.reduce(
      (acc, item) => acc + (Number(item.stok) || 0),
      0,
    ),
    stokMenipis: obatList.filter((item) => Number(item.stok) <= 10).length,
    mendekatiKadaluarsa: 0,
    kadaluarsa: 0,
  };

  const now = new Date();
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);

  obatList.forEach((item) => {
    const exp = new Date(item.tanggalKadaluarsa);
    if (exp < now) {
      summary.kadaluarsa += 1;
    } else if (exp <= thirtyDaysAhead) {
      summary.mendekatiKadaluarsa += 1;
    }
  });

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
