import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Product } from '../types/product.types';

export const searchApi = {
  query: async (q: string, page = 1, limit = 20) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Product>>>(ENDPOINTS.SEARCH.QUERY, {
      params: { q, page, limit },
    });
    return data.data;
  },

  suggestions: async (q: string) => {
    const { data } = await apiClient.get<ApiResponse<Array<{ id: string, name: string, slug: string, price: number, image: string | null }>>>(ENDPOINTS.SEARCH.SUGGESTIONS, {
      params: { q },
    });
    return data.data;
  },
};
