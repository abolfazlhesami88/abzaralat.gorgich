import { apiClient } from './client';
import type { ApiResponse, PaginatedData } from '../types/api.types';
import type { Review, RatingSummary } from '../types/review.types';

export const reviewsApi = {
  list: async (slug: string, page = 1) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Review>>>(
      `/products/${slug}/reviews`, { params: { page } },
    );
    return data.data;
  },

  summary: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<RatingSummary>>(
      `/products/${slug}/reviews/summary`,
    );
    return data.data;
  },

  create: async (slug: string, payload: { productId: string; rating: number; title?: string; body: string; orderId?: string }) => {
    const { data } = await apiClient.post<ApiResponse<Review>>(
      `/products/${slug}/reviews`, payload,
    );
    return data.data;
  },

  markHelpful: async (reviewId: string) => {
    const { data } = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return data.data;
  },
};
