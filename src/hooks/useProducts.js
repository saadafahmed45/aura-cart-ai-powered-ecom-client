import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useProducts() {
  const queryClient = useQueryClient();

  const useGetProductsQuery = (filters = {}) => {
    return useQuery({
      queryKey: ['products', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.rating) params.append('rating', filters.rating);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.status) params.append('status', filters.status);
        if (filters.featured) params.append('featured', filters.featured);
        if (filters.dashboard) params.append('dashboard', filters.dashboard);

        const res = await api.get(`/products?${params.toString()}`);
        return res.data;
      }
    });
  };

  const useGetProductQuery = (id) => {
    return useQuery({
      queryKey: ['product', id],
      queryFn: async () => {
        const res = await api.get(`/products/${id}`);
        return res.data.product;
      },
      enabled: !!id
    });
  };

  const useGetRelatedProductsQuery = (id) => {
    return useQuery({
      queryKey: ['products-related', id],
      queryFn: async () => {
        const res = await api.get(`/products/${id}/related`);
        return res.data.products;
      },
      enabled: !!id
    });
  };

  const useGetProductReviewsQuery = (id) => {
    return useQuery({
      queryKey: ['reviews-product', id],
      queryFn: async () => {
        const res = await api.get(`/reviews/product/${id}`);
        return res.data.reviews;
      },
      enabled: !!id
    });
  };

  const submitReviewMutation = useMutation({
    mutationFn: async ({ productId, rating, comment }) => {
      const res = await api.post(`/reviews/product/${productId}`, { rating, comment });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews-product', variables.productId] });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post('/products', formData);
      return res.data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const res = await api.put(`/products/${id}`, formData);
      return res.data.product;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    getProductsQuery: useGetProductsQuery,
    getProductQuery: useGetProductQuery,
    getRelatedProductsQuery: useGetRelatedProductsQuery,
    getProductReviewsQuery: useGetProductReviewsQuery,
    
    submitReview: submitReviewMutation.mutateAsync,
    isSubmittingReview: submitReviewMutation.isPending,

    createProduct: createProductMutation.mutateAsync,
    isCreatingProduct: createProductMutation.isPending,

    updateProduct: updateProductMutation.mutateAsync,
    isUpdatingProduct: updateProductMutation.isPending,

    deleteProduct: deleteProductMutation.mutateAsync,
    isDeletingProduct: deleteProductMutation.isPending
  };
}
