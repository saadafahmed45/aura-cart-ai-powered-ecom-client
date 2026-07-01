import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setCredentials: (user, accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    }
    set({ user, accessToken, isAuthenticated: true });
  },

  setAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ accessToken });
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');
      if (user && accessToken) {
        set({
          user: JSON.parse(user),
          accessToken,
          isAuthenticated: true,
          isInitialized: true
        });
        return;
      }
    }
    set({ isInitialized: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  }
}));
