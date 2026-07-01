import { create } from 'zustand';
import api from '../lib/api';

export const useWishlistStore = create((set, get) => ({
  items: [],
  isInitialized: false,

  initializeWishlist: async (isAuthenticated) => {
    if (typeof window === 'undefined') return;

    if (isAuthenticated) {
      try {
        const res = await api.get('/users/wishlist');
        set({ items: res.data.wishlist, isInitialized: true });
        localStorage.setItem('wishlist', JSON.stringify(res.data.wishlist));
      } catch (error) {
        console.error('Failed to fetch user wishlist from server', error);
        const local = localStorage.getItem('wishlist');
        set({ items: local ? JSON.parse(local) : [], isInitialized: true });
      }
    } else {
      const local = localStorage.getItem('wishlist');
      set({ items: local ? JSON.parse(local) : [], isInitialized: true });
    }
  },

  toggleWishlist: async (product, isAuthenticated) => {
    const { items } = get();
    const exists = items.some(item => item._id === product._id);

    let updatedItems;
    if (exists) {
      updatedItems = items.filter(item => item._id !== product._id);
    } else {
      updatedItems = [...items, product];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
    }
    set({ items: updatedItems });

    if (isAuthenticated) {
      try {
        const res = await api.post(`/users/wishlist/${product._id}`);
        set({ items: res.data.wishlist });
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlist', JSON.stringify(res.data.wishlist));
        }
      } catch (error) {
        console.error('Failed to toggle wishlist on server', error);
      }
    }
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some(item => item._id === productId);
  },

  clearWishlist: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wishlist');
    }
    set({ items: [] });
  }
}));
