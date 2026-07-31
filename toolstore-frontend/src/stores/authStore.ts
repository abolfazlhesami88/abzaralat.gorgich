import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

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
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
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
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isInitializing: false,
            });
          }
        } catch {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isInitializing: false,
          });
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
