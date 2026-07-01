'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ToastProvider } from '../components/common/Toast';

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  }));

  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const initializeWishlist = useWishlistStore((state) => state.initializeWishlist);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    initializeAuth();
    initializeCart();
  }, [initializeAuth, initializeCart]);

  useEffect(() => {
    if (isAuthInitialized) {
      initializeWishlist(isAuthenticated);
    }
  }, [isAuthInitialized, isAuthenticated, initializeWishlist]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
