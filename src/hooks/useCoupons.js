import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export function useCoupons() {
  const queryClient = useQueryClient();

  const validateCouponMutation = useMutation({
    mutationFn: async (code) => {
      const res = await api.post('/coupons/validate', { code });
      return res.data.coupon;
    }
  });

  const useGetCouponsQuery = () => {
    return useQuery({
      queryKey: ['coupons'],
      queryFn: async () => {
        const res = await api.get('/coupons');
        return res.data.coupons;
      }
    });
  };

  const createCouponMutation = useMutation({
    mutationFn: async (couponData) => {
      const res = await api.post('/coupons', couponData);
      return res.data.coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, couponData }) => {
      const res = await api.put(`/coupons/${id}`, couponData);
      return res.data.coupon;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/coupons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });

  return {
    validateCoupon: validateCouponMutation.mutateAsync,
    isValidatingCoupon: validateCouponMutation.isPending,

    getCouponsQuery: useGetCouponsQuery,
    createCoupon: createCouponMutation.mutateAsync,
    isCreatingCoupon: createCouponMutation.isPending,
    updateCoupon: updateCouponMutation.mutateAsync,
    isUpdatingCoupon: updateCouponMutation.isPending,
    deleteCoupon: deleteCouponMutation.mutateAsync,
    isDeletingCoupon: deleteCouponMutation.isPending
  };
}
