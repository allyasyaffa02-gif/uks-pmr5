import { useQuery } from '@tanstack/react-query';
import { getKategoriApi } from '../services/uks.service';

export const useUksKategori = () => {
  const kategoriQuery = useQuery({
    queryKey: ['uks', 'kategori'],
    queryFn: getKategoriApi,
  });

  return {
    kategoriList: kategoriQuery.data || [],
    isLoading: kategoriQuery.isLoading,
    isError: kategoriQuery.isError,
  };
};
