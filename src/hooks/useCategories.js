import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useCategories() {
  const queryClient = useQueryClient();

  const useGetCategoriesQuery = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        const res = await api.get('/categories');
        return res.data.categories;
      }
    });
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post('/categories', formData);
      return res.data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.put(`/categories/${id}`, formData);
      return res.data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  return {
    getCategoriesQuery: useGetCategoriesQuery,
    createCategory: createCategoryMutation.mutateAsync,
    isCreatingCategory: createCategoryMutation.isPending,
    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdatingCategory: updateCategoryMutation.isPending,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeletingCategory: deleteCategoryMutation.isPending
  };
}
