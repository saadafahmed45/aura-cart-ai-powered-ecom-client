import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useUsers() {
  const queryClient = useQueryClient();

  const getUsersQuery = (filters = {}) => {
    return useQuery({
      queryKey: ['users', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.search) params.append('search', filters.search);

        const res = await api.get(`/users?${params.toString()}`);
        return res.data;
      }
    });
  };

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, role, status }) => {
      const res = await api.put(`/users/${id}`, { role, status });
      return res.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  return {
    getUsersQuery,
    updateUser: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending
  };
}
