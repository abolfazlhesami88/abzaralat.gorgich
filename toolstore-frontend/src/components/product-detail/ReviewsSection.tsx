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
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { isAuthenticated } = useAuthStore();
  
  const { data: summary } = useRatingSummary(productSlug);
  const { data: reviewsData, isLoading } = useProductReviews(productSlug, page);

  const displayedReviews = reviewsData?.items?.filter(
    (review) => selectedRating === null || review.rating === selectedRating,
  );

  return (
    <div className="space-y-8">
      {summary && summary.totalReviews > 0 && (
        <RatingDistribution
          summary={summary}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
        />
      )}

      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold font-display text-text-primary">نظرات کاربران</h3>
          {selectedRating && (
            <span className="text-xs bg-gold-light/40 text-gold-dark px-2.5 py-1 rounded-full font-semibold border border-gold/30">
              فیلتر: {selectedRating} ستاره
            </span>
          )}
        </div>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark bg-gold-light/20 hover:bg-gold-light/40 border border-gold/30 px-4 py-2 rounded-button shadow-sm hover:shadow-gold-glow transition-all duration-200"
          >
            <MessageSquarePlus size={16} />
            {showForm ? 'بستن فرم نظر' : 'ثبت نظر جدید'}
          </button>
        ) : (
          <Link to="/login" className="text-sm font-medium text-text-muted hover:text-gold-dark transition-colors">
            برای ثبت نظر وارد شوید
          </Link>
        )}
      </div>

      {showForm && isAuthenticated && (
        <div className="bg-surface p-6 border border-border/80 rounded-card shadow-sm animate-slide-up">
          <h4 className="font-bold text-sm text-text-primary mb-4">دیدگاه خود را بنویسید</h4>
          <WriteReviewForm
            productId={productId}
            slug={productSlug}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-text-muted bg-surface/40 rounded-card border border-border/40">در حال بارگذاری نظرات...</div>
        ) : !displayedReviews?.length ? (
          <div className="py-12 text-center text-text-muted bg-surface/40 rounded-card border border-border/40">
            {selectedRating ? `هیچ نظری با نمره ${selectedRating} ستاره ثبت نشده است.` : 'هنوز نظری برای این محصول ثبت نشده است.'}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {reviewsData && reviewsData.meta.totalPages > 1 && (
              <div className="pt-4">
                <Pagination
                  currentPage={reviewsData.meta.page}
                  totalPages={reviewsData.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
