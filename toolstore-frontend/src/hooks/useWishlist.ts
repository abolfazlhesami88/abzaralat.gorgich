import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export interface WishlistItem {
  id: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string | null;
  };
}

export const useWishlist = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await apiClient.get('/wishlist');
      return data.data;
    },
    enabled: isAuthenticated,
  });
};

export const useToggleWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await apiClient.post(`/wishlist/${productId}`);
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
};

export const useWishlistProductIds = () => {
  const { data } = useWishlist();
  return data?.map((item) => item.product?.id) ?? [];
};
