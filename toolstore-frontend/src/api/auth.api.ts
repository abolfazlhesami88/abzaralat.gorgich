import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data.data;
  },
  register: async (credentials: any) => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, credentials);
    return data.data;
  },
  logout: async () => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },
  me: async () => {
    const { data } = await apiClient.get(ENDPOINTS.AUTH.ME);
    return data.data;
  },
};
