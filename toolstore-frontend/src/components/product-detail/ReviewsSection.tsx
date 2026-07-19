import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useProductReviews, useRatingSummary } from '../../hooks/useReviews';
import { RatingDistribution } from './RatingDistribution';
import { ReviewCard } from './ReviewCard';
import { WriteReviewForm } from './WriteReviewForm';
import { Pagination } from '../products/Pagination';
import { MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ReviewsSection({ productSlug, productId }: { productSlug: string; productId: string }) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useAuthStore();
  
  const { data: summary } = useRatingSummary(productSlug);
  const { data: reviewsData, isLoading } = useProductReviews(productSlug, page);

  return (
    <div className="space-y-10">
      {summary && summary.totalReviews > 0 && (
        <RatingDistribution summary={summary} />
      )}

      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-text-primary">نظرات کاربران</h3>
        {isAuthenticated ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-sm font-semibold text-gold-dark hover:underline"
          >
            <MessageSquarePlus size={16} />
            ثبت نظر جدید
          </button>
        ) : (
          <Link to="/login" className="text-sm font-medium text-text-muted hover:text-gold-dark">
            برای ثبت نظر وارد شوید
          </Link>
        )}
      </div>

      {showForm && isAuthenticated && (
        <div className="bg-surface p-6 border border-border rounded-card animate-slide-up">
          <h4 className="font-semibold text-sm mb-4">دیدگاه خود را بنویسید</h4>
          <WriteReviewForm
            productId={productId}
            slug={productSlug}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <div className="py-10 text-center text-text-muted">در حال بارگذاری نظرات...</div>
        ) : !reviewsData?.items.length ? (
          <div className="py-10 text-center text-text-muted">هنوز نظری برای این محصول ثبت نشده است.</div>
        ) : (
          <>
            {reviewsData.items.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            <Pagination
              currentPage={reviewsData.meta.page}
              totalPages={reviewsData.meta.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
