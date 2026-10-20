import { useQuery } from "@tanstack/react-query";
import {
  createJurusanApi,
  deleteJurusanApi,
  getJurusanListApi,
  updateJurusanApi,
} from "../services/jurusan.service";
import {
  CreateJurusanInput,
  UpdateJurusanInput,
} from "../types/jurusan";
import { useToastMutation } from "../../../hooks/useToastMutation";

export const JURUSAN_QUERY_KEY = ["master-jurusan"];

export function useJurusan(search?: string) {
  const query = useQuery({
    queryKey: [...JURUSAN_QUERY_KEY, search],
    queryFn: () => getJurusanListApi(search ? { search } : undefined),
  });

  const createMutation = useToastMutation({
    mutationFn: (data: CreateJurusanInput) => createJurusanApi(data),
    successMessage: "Jurusan berhasil ditambahkan",
    invalidateQueries: JURUSAN_QUERY_KEY,
  });

  const updateMutation = useToastMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJurusanInput }) =>
      updateJurusanApi(id, data),
    successMessage: "Jurusan berhasil diperbarui",
    invalidateQueries: JURUSAN_QUERY_KEY,
  });

  const deleteMutation = useToastMutation({
    mutationFn: (id: number) => deleteJurusanApi(id),
    successMessage: "Jurusan berhasil dihapus",
    invalidateQueries: JURUSAN_QUERY_KEY,
  });

  return {
    jurusanList: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    createJurusan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateJurusan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteJurusan: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}