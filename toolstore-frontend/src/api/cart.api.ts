import { apiClient } from './client';
import type { CartSummary } from '../types/cart.types';
import type { ApiResponse } from '../types/api.types';

const withSession = (sessionId?: string) =>
  sessionId ? { headers: { 'x-session-id': sessionId } } : {};

export const cartApi = {
  get: async (sessionId?: string) => {
    const { data } = await apiClient.get<ApiResponse<CartSummary>>('/cart', withSession(sessionId));
    return data.data;
  },

  addItem: async (payload: { productId: string; variantId?: string; quantity: number }, sessionId?: string) => {
    const { data } = await apiClient.post<ApiResponse<CartSummary>>('/cart/items', payload, withSession(sessionId));
    return data.data;
  },

  updateItem: async (itemId: string, quantity: number, sessionId?: string) => {
    const { data } = await apiClient.patch<ApiResponse<CartSummary>>(`/cart/items/${itemId}`, { quantity }, withSession(sessionId));
    return data.data;
  },

  removeItem: async (itemId: string, sessionId?: string) => {
    const { data } = await apiClient.delete<ApiResponse<CartSummary>>(`/cart/items/${itemId}`, withSession(sessionId));
    return data.data;
  },

  applyCoupon: async (code: string, sessionId?: string) => {
    const { data } = await apiClient.post<ApiResponse<CartSummary>>('/cart/apply-coupon', { couponCode: code }, withSession(sessionId));
    return data.data;
  },

  removeCoupon: async (sessionId?: string) => {
    const { data } = await apiClient.delete<ApiResponse<CartSummary>>('/cart/coupon', withSession(sessionId));
    return data.data;
  },

  mergeGuest: async (sessionId: string) => {
    await apiClient.post('/cart/merge-guest', { sessionId });
  },
};
