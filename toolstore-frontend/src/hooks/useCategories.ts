import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoriesApi.tree(),
  });

export const useCategory = (slug: string) =>
  useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
  });
