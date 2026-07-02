import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const clearAuthStore = useAuthStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      setCredentials(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    },
    onSuccess: (data) => {
      setCredentials(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuthStore();
      clearCart();
      clearWishlist();
      queryClient.clear();
    }
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (credential) => {
      const res = await api.post('/auth/google', { credential });
      return res.data;
    },
    onSuccess: (data) => {
      setCredentials(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data.user;
    },
    enabled: isAuthenticated,
    retry: false
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const res = await api.put('/users/profile', profileData);
      return res.data.user;
    },
    onSuccess: (updatedUser) => {
      const currentToken = useAuthStore.getState().accessToken;
      setCredentials(updatedUser, currentToken);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const addAddressMutation = useMutation({
    mutationFn: async (addressData) => {
      const res = await api.post('/users/addresses', addressData);
      return res.data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ addressId, addressData }) => {
      const res = await api.put(`/users/addresses/${addressId}`, addressData);
      return res.data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId) => {
      const res = await api.delete(`/users/addresses/${addressId}`);
      return res.data.addresses;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    addAddress: addAddressMutation.mutateAsync,
    isAddingAddress: addAddressMutation.isPending,

    updateAddress: updateAddressMutation.mutateAsync,
    isUpdatingAddress: updateAddressMutation.isPending,

    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,

    googleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoggingIn: googleLoginMutation.isPending
  };
}
