import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useOrders() {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const res = await api.post('/orders', orderData);
      return res.data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'myorders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const useGetMyOrdersQuery = (page = 1) => {
    return useQuery({
      queryKey: ['orders', 'myorders', page],
      queryFn: async () => {
        const res = await api.get(`/orders/myorders?page=${page}`);
        return res.data;
      }
    });
  };

  const useGetOrderDetailsQuery = (id) => {
    return useQuery({
      queryKey: ['order', id],
      queryFn: async () => {
        const res = await api.get(`/orders/${id}`);
        return res.data.order;
      },
      enabled: !!id
    });
  };

  const useGetAdminOrdersQuery = (filters = {}) => {
    return useQuery({
      queryKey: ['orders', 'admin', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.status) params.append('status', filters.status);

        const res = await api.get(`/orders?${params.toString()}`);
        return res.data;
      }
    });
  };

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, orderStatus, paymentStatus }) => {
      const res = await api.put(`/orders/${id}/status`, { orderStatus, paymentStatus });
      return res.data.order;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const useGetAnalyticsQuery = () => {
    return useQuery({
      queryKey: ['analytics'],
      queryFn: async () => {
        const res = await api.get('/orders/analytics/stats');
        return res.data;
      }
    });
  };

  return {
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,

    getMyOrdersQuery: useGetMyOrdersQuery,
    getOrderDetailsQuery: useGetOrderDetailsQuery,

    getAdminOrdersQuery: useGetAdminOrdersQuery,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    getAnalyticsQuery: useGetAnalyticsQuery
  };
}
