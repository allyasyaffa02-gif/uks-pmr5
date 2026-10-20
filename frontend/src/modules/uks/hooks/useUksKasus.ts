import { useQuery } from "@tanstack/react-query";
import {
  createKasusApi,
  deleteKasusApi,
  getKasusApi,
} from "../services/uks.service";
import { CreateKasusInput, KasusFilterParams } from "../types/uks";
import { useToastMutation } from "../../../hooks/useToastMutation";

export const UKS_KASUS_QUERY_KEY = ["uks", "kasus"];

/** Prefix query untuk seluruh data UKS (kasus, rekap, stats, kategori). */
export const UKS_QUERY_KEY = ["uks"];

export const useUksKasus = (filterParams?: KasusFilterParams) => {
  const kasusQuery = useQuery({
    queryKey: [...UKS_KASUS_QUERY_KEY, filterParams],
    queryFn: () => getKasusApi(filterParams),
  });

  const createMutation = useToastMutation({
    mutationFn: (newKasus: CreateKasusInput) => createKasusApi(newKasus),
    successMessage: "Catatan kasus berhasil disimpan",
    invalidateQueries: UKS_QUERY_KEY,
  });

  const deleteMutation = useToastMutation({
    mutationFn: (id: number) => deleteKasusApi(id),
    successMessage: "Catatan kasus berhasil dihapus",
    invalidateQueries: UKS_QUERY_KEY,
  });

  return {
    kasusList: kasusQuery.data || [],
    isLoading: kasusQuery.isLoading,
    isError: kasusQuery.isError,
    error: kasusQuery.error,
    refetch: kasusQuery.refetch,
    createKasus: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteKasus: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
