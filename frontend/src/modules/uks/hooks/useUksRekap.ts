import { useQuery } from '@tanstack/react-query';
import { getRekapApi } from '../services/uks.service';

export const useUksRekap = () => {
  const rekapQuery = useQuery({
    queryKey: ['uks', 'rekap'],
    queryFn: getRekapApi,
  });

  return {
    rekapList: rekapQuery.data || [],
    isLoading: rekapQuery.isLoading,
    isError: rekapQuery.isError,
    error: rekapQuery.error,
    refetch: rekapQuery.refetch,
  };
};
