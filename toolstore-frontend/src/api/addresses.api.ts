import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';

export interface Address {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
}

export const addressesApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Address[]>>('/addresses');
    return data.data;
  },
  create: async (payload: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
    const { data } = await apiClient.post<ApiResponse<Address>>('/addresses', payload);
    return data.data;
  },
  update: async (id: string, payload: Partial<Address>) => {
    const { data } = await apiClient.patch<ApiResponse<Address>>(`/addresses/${id}`, payload);
    return data.data;
  },
  remove: async (id: string) => {
    await apiClient.delete(`/addresses/${id}`);
  },
  setDefault: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<Address[]>>(`/addresses/${id}/set-default`);
    return data.data;
  },
};
