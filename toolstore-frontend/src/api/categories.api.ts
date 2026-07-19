import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/api.types';
import type { Category } from '../types/product.types';

export const categoriesApi = {
  tree: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES.TREE);
    return data.data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Category>>(ENDPOINTS.CATEGORIES.DETAIL(slug));
    return data.data;
  },
};
