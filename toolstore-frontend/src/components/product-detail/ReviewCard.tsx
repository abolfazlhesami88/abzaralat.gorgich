import { useState } from 'react';
import { ThumbsUp, BadgeCheck } from 'lucide-react';
import type { Review } from '../../types/review.types';
import { RatingStars } from '../shared/RatingStars';
import { reviewsApi } from '../../api/reviews.api';
import { cn } from '../../utils/cn';

export function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isMarkedHelpful, setIsMarkedHelpful] = useState(false);

  const handleHelpful = async () => {
    if (isMarkedHelpful) return;
    try {
      setHelpfulCount((prev) => prev + 1);
      setIsMarkedHelpful(true);
      await reviewsApi.markHelpful(review.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-5 rounded-card bg-surface/60 border border-border/80 shadow-sm hover:border-gold/40 transition-all duration-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm text-text-primary">{review.userName}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-pill border border-success/20">
            <BadgeCheck size={13} /> خریدار واقعی
          </span>
        </div>
        <span className="text-xs text-text-muted">
          {new Date(review.createdAt).toLocaleDateString('fa-IR')}
        </span>
      </div>

      <RatingStars rating={review.rating} size="sm" />

      {review.title && <h4 className="font-bold text-sm text-text-primary pt-1">{review.title}</h4>}
      
      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
        {review.body}
      </p>

      <div className="flex justify-end pt-2 border-t border-border/40">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={isMarkedHelpful}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-button transition-all duration-200',
            isMarkedHelpful
              ? 'text-gold-dark bg-gold-light/40 border-gold font-bold shadow-sm'
              : 'text-text-secondary hover:text-gold-dark bg-background hover:bg-gold-light/20 border-border/60',
          )}
        >
          <ThumbsUp size={14} className={isMarkedHelpful ? 'fill-gold-dark text-gold-dark' : ''} />
          <span>مفید بود ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
