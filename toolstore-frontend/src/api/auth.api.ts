import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  requestOtp: async (data: { phone: string }) => {
    const { data: res } = await apiClient.post(ENDPOINTS.AUTH.REQUEST_OTP, data);
    return res;
  },
  verifyOtp: async (data: { phone: string; code: string }) => {
    const { data: res } = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    return res.data;
  },
  login: async (credentials: Record<string, unknown>) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data.data;
  },
  register: async (credentials: Record<string, unknown>) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, credentials);
    return data.data;
  },
  logout: async () => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },
  refresh: async () => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REFRESH);
    return data.data;
  },
  me: async () => {
    const { data } = await apiClient.get(ENDPOINTS.AUTH.ME);
    return data.data;
  },
};
