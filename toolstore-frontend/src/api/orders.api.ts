import { apiClient } from './client';
import type { Order } from '../types/order.types';
import type { ApiResponse, PaginatedData } from '../types/api.types';

export const ordersApi = {
  checkout: async (payload: { addressId: string; paymentMethod: string; couponCode?: string; notes?: string }) => {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders/checkout', payload);
    return data.data;
  },

  list: async (page = 1) => {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<Order>>>('/orders', { params: { page } });
    return data.data;
  },

  getDetail: async (orderNumber: string) => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${orderNumber}`);
    return data.data;
  },

  cancel: async (orderNumber: string) => {
    const { data } = await apiClient.post<ApiResponse<Order>>(`/orders/${orderNumber}/cancel`);
    return data.data;
  },
};
