import { RatingStars } from '../shared/RatingStars';
import { toPersianDigits } from '../../utils/formatPrice';
import type { RatingSummary } from '../../types/review.types';

export function RatingDistribution({ summary }: { summary: RatingSummary }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-background rounded-card">
      <div className="text-center md:border-l md:border-border md:pl-8 shrink-0">
        <p className="text-5xl font-bold text-text-primary">{toPersianDigits(summary.averageRating.toFixed(1))}</p>
        <RatingStars rating={summary.averageRating} />
        <p className="text-xs text-text-muted mt-1">
          از {toPersianDigits(summary.totalReviews)} نظر
        </p>
      </div>

      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.distribution[star] ?? 0;
          const percent = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-12 text-text-secondary">{toPersianDigits(star)} ستاره</span>
              <div className="flex-1 h-2 bg-border rounded-pill overflow-hidden">
                <div className="h-full bg-gold rounded-pill" style={{ width: `${percent}%` }} />
              </div>
              <span className="w-6 text-text-muted">{toPersianDigits(count)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
