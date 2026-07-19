import { ThumbsUp, BadgeCheck } from 'lucide-react';
import type { Review } from '../../types/review.types';
import { RatingStars } from '../shared/RatingStars';
import { reviewsApi } from '../../api/reviews.api';

export function ReviewCard({ review }: { review: Review }) {
  const handleHelpful = async () => {
    try {
      await reviewsApi.markHelpful(review.id);
      // برای بهبود UI بهتر است از mutation react-query استفاده شود
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-5 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-text-primary">{review.userName}</span>
          {review.isVerifiedPurchase && (
            <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-pill">
              <BadgeCheck size={12} /> خرید تأییدشده
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {new Date(review.createdAt).toLocaleDateString('fa-IR')}
        </span>
      </div>

      <RatingStars rating={review.rating} size="sm" />

      {review.title && <h4 className="font-semibold text-sm mt-2">{review.title}</h4>}
      
      <p className="text-sm text-text-secondary mt-2 leading-relaxed whitespace-pre-wrap">
        {review.body}
      </p>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleHelpful}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-gold-dark transition-colors"
        >
          <ThumbsUp size={14} />
          <span>مفید بود ({review.helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
