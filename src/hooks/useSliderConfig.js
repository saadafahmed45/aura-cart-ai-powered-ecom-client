import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useSliderConfig() {
  const queryClient = useQueryClient();

  const useGetSliderConfigQuery = () => {
    return useQuery({
      queryKey: ['slider-config'],
      queryFn: async () => {
        const res = await api.get('/slider-config');
        return res.data.config;
      },
      staleTime: 5 * 60 * 1000
    });
  };

  const updateSliderConfigMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/slider-config', data);
      return res.data.config;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slider-config'] });
    }
  });

  return {
    getSliderConfigQuery: useGetSliderConfigQuery,
    updateSliderConfig: updateSliderConfigMutation.mutateAsync,
    isUpdatingSliderConfig: updateSliderConfigMutation.isPending
  };
}
