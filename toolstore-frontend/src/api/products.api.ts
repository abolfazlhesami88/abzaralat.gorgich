import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Product, ProductQueryParams } from '../types/product.types';

export const productsApi = {
  list: async (params: ProductQueryParams) => {
    // پارامترهای false/undefined حذف می‌شوند تا بکاند آن‌ها را اشتباه parse نکند
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== false && v !== undefined && v !== null)
    );
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Product>>>(
      ENDPOINTS.PRODUCTS.LIST,
      { params: cleanParams },
    );
    return data.data;
  },

  all: async () => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Product>>>(
      ENDPOINTS.PRODUCTS.LIST,
      { params: { limit: 500 } },
    );
    return data.data.items;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.DETAIL(slug),
    );
    return data.data;
  },

  featured: async () => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(ENDPOINTS.PRODUCTS.FEATURED);
    return data.data;
  },

  newArrivals: async () => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(ENDPOINTS.PRODUCTS.NEW_ARRIVALS);
    return data.data;
  },

  bestSellers: async () => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(ENDPOINTS.PRODUCTS.BEST_SELLERS);
    return data.data;
  },

  related: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(ENDPOINTS.PRODUCTS.RELATED(slug));
    return data.data;
  },
};
