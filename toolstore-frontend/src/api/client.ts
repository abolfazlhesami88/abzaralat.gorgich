import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v?: unknown) => void; reject: (e?: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(undefined)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/logout')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = `${BASE_URL.replace(/\/$/, '')}/auth/refresh`;
        const res = await axios.post(refreshUrl, {}, { withCredentials: true });

        const newToken = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);

        processQueue(null);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // FIX [Data Leakage Prevention]:
        // فراخوانی logout() استیت‌های React Query، Zustand و localStorage را پاک‌سازی می‌کند
        // تا اطلاعات کاربر قبلی در حافظه یا مرورگر باقی نماند.
        useAuthStore.getState().logout();
        
        // Redirect to admin login if 401 occurs on admin paths.
        // For public or customer protected routes, do not forcibly set window.location.href = '/login'.
        // PrivateRoute will handle redirection for protected customer routes (/account),
        // while guest users browsing public routes remain on their current page.
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/adminsite')) {
          if (currentPath !== '/adminsite') {
            window.location.href = '/adminsite';
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
