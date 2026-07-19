import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import type { ProductQueryParams } from '../types/product.types';

export const useProducts = (params: ProductQueryParams) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
    placeholderData: (prev) => prev, // برای جلوگیری از پرش UI هنگام تغییر صفحه
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useFeaturedProducts = () =>
  useQuery({ queryKey: ['products', 'featured'], queryFn: productsApi.featured });

export const useNewArrivals = () =>
  useQuery({ queryKey: ['products', 'new-arrivals'], queryFn: productsApi.newArrivals });

export const useBestSellers = () =>
  useQuery({ queryKey: ['products', 'best-sellers'], queryFn: productsApi.bestSellers });
