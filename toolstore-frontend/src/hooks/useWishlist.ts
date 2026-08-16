import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!isAuthenticated) {
        navigate('/login');
        throw new Error('unauthenticated');
      }
      const { data } = await apiClient.post(`/wishlist/${productId}`);
      return data.data;
    },
    onSuccess: (result: any) => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      // result.added: true = added, false = removed
      if (result?.added !== undefined) {
        toast.success(result.added ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد');
      }
    },
    onError: (error: any) => {
      if (error?.message === 'unauthenticated') return; // redirect انجام شد
      const msg =
        error?.response?.data?.message ?? 'خطا در ثبت علاقه‌مندی. لطفاً دوباره تلاش کنید.';
      toast.error(msg);
    },
  });
};

export const useWishlistProductIds = (): string[] => {
  const { data } = useWishlist();
  return data?.map((item) => item.product?.id ?? item.productId) ?? [];
};
