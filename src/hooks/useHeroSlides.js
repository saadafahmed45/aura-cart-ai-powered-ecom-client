import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useHeroSlides() {
  const queryClient = useQueryClient();

  const getHeroSlidesQuery = () => {
    return useQuery({
      queryKey: ['hero-slides'],
      queryFn: async () => {
        const res = await api.get('/hero-slides');
        return res.data.slides;
      }
    });
  };

  const getAllHeroSlidesQuery = () => {
    return useQuery({
      queryKey: ['hero-slides-all'],
      queryFn: async () => {
        const res = await api.get('/hero-slides/all');
        return res.data.slides;
      }
    });
  };

  const createHeroSlideMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post('/hero-slides', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.slide;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides-all'] });
    }
  });

  const updateHeroSlideMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.put(`/hero-slides/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.slide;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides-all'] });
    }
  });

  const deleteHeroSlideMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/hero-slides/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      queryClient.invalidateQueries({ queryKey: ['hero-slides-all'] });
    }
  });

  return {
    getHeroSlidesQuery,
    getAllHeroSlidesQuery,

    createHeroSlide: createHeroSlideMutation.mutateAsync,
    isCreatingHeroSlide: createHeroSlideMutation.isPending,

    updateHeroSlide: updateHeroSlideMutation.mutateAsync,
    isUpdatingHeroSlide: updateHeroSlideMutation.isPending,

    deleteHeroSlide: deleteHeroSlideMutation.mutateAsync,
    isDeletingHeroSlide: deleteHeroSlideMutation.isPending
  };
}
