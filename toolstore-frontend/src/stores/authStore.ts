import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { queryClient } from '../api/queryClient';
import { useCartStore } from './cartStore';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'customer' | 'admin';
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: true,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => {
        // 0. ابطال رفرش توکن در سمت سرور (بدون انتظار — fire-and-forget)
        apiClient.post(ENDPOINTS.AUTH.LOGOUT).catch(() => {});

        // 1. پاک‌سازی کامل استیت احراز هویت
        set({ user: null, accessToken: null, isAuthenticated: false });
        
        // 2. پاک‌سازی کامل حافظه کش React Query (پیشگیری از افشای اطلاعات کاربران قبلی)
        queryClient.clear();

        // 3. پاک‌سازی استیت سبد خرید و مابقی استورها
        useCartStore.getState().clearLocalCart();

        // 4. حذف داده‌های حساس از localStorage
        try {
          localStorage.removeItem('ts-session-id');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('toolstore-cart');
        } catch {
          // در صورت بلاک بودن localStorage خطا صادر نشود
        }
      },
      initAuth: async () => {
        if (!get().isAuthenticated) {
          set({ isInitializing: false });
          return;
        }
        try {
          const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH);
          if (data.data?.accessToken && data.data?.user) {
            set({
              user: data.data.user,
              accessToken: data.data.accessToken,
              isAuthenticated: true,
              isInitializing: false,
            });
          } else {
            get().logout();
            set({ isInitializing: false });
          }
        } catch {
          get().logout();
          set({ isInitializing: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
