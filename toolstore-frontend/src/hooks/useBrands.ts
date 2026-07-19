import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../api/brands.api';

export const useBrands = () =>
  useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.list(),
  });

export const useBrand = (slug: string) =>
  useQuery({
    queryKey: ['brand', slug],
    queryFn: () => brandsApi.getBySlug(slug),
    enabled: !!slug,
  });
