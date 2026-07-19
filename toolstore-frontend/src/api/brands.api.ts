import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/api.types';
import type { Brand } from '../types/product.types';

export const brandsApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<Brand[]>>(ENDPOINTS.BRANDS.LIST);
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Brand>>(ENDPOINTS.BRANDS.DETAIL(slug));
    return data.data;
  },
};
