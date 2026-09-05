import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getKasusApi, createKasusApi, deleteKasusApi } from '../services/uks.service';
import { KasusFilterParams, CreateKasusInput } from '../types/uks';

export const UKS_KASUS_QUERY_KEY = ['uks', 'kasus'];

export const useUksKasus = (filterParams?: KasusFilterParams) => {
  const queryClient = useQueryClient();

  const kasusQuery = useQuery({
    queryKey: [...UKS_KASUS_QUERY_KEY, filterParams],
    queryFn: () => getKasusApi(filterParams),
  });

  const createMutation = useMutation({
    mutationFn: (newKasus: CreateKasusInput) => createKasusApi(newKasus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteKasusApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uks'] });
    },
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
