import { useQuery } from '@tanstack/react-query';
import { getStatsApi } from '../services/uks.service';

export const useUksStats = () => {
  const statsQuery = useQuery({
    queryKey: ['uks', 'stats'],
    queryFn: getStatsApi,
  });

  return {
    stats: statsQuery.data || { total: 0, upacara: 0, harian: 0 },
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    refetch: statsQuery.refetch,
  };
};
