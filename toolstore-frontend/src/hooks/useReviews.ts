import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';

export const useProductReviews = (slug: string, page = 1) =>
  useQuery({
    queryKey: ['reviews', slug, page],
    queryFn: () => reviewsApi.list(slug, page),
    enabled: !!slug,
  });

export const useRatingSummary = (slug: string) =>
  useQuery({
    queryKey: ['reviews-summary', slug],
    queryFn: () => reviewsApi.summary(slug),
    enabled: !!slug,
  });

export const useCreateReview = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof reviewsApi.create>[1]) =>
      reviewsApi.create(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', slug] });
      queryClient.invalidateQueries({ queryKey: ['reviews-summary', slug] });
    },
  });
};
