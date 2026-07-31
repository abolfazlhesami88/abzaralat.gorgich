import { RatingStars } from '../shared/RatingStars';
import { toPersianDigits } from '../../utils/formatPrice';
import type { RatingSummary } from '../../types/review.types';
import { cn } from '../../utils/cn';

interface RatingDistributionProps {
  summary: RatingSummary;
  selectedRating?: number | null;
  onSelectRating?: (rating: number | null) => void;
}

export function RatingDistribution({ summary, selectedRating, onSelectRating }: RatingDistributionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-surface border border-border/80 rounded-card shadow-sm items-center">
      <div className="text-center md:border-l md:border-border/60 md:pl-8 shrink-0 flex flex-col items-center justify-center">
        <p className="text-5xl font-extrabold text-gold-dark tracking-tight font-display mb-1">
          {toPersianDigits(summary.averageRating.toFixed(1))}
        </p>
        <RatingStars rating={summary.averageRating} size="md" />
        <p className="text-xs text-text-muted mt-2">
          از مجموع {toPersianDigits(summary.totalReviews)} نظر ثبت‌شده
        </p>
        {selectedRating && (
          <button
            type="button"
            onClick={() => onSelectRating?.(null)}
            className="mt-3 text-xs text-gold-dark hover:underline font-semibold"
          >
            نمایش همه نظرات
          </button>
        )}
      </div>

      <div className="flex-1 w-full space-y-2.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.distribution[star] ?? 0;
          const percent = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
          const isSelected = selectedRating === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectRating?.(isSelected ? null : star)}
              className={cn(
                'w-full flex items-center gap-3 text-xs font-medium p-1.5 rounded-button transition-all duration-200 text-right hover:bg-gold-light/20 cursor-pointer',
                isSelected && 'bg-gold-light/40 ring-1 ring-gold font-bold',
              )}
            >
              <span className="w-14 text-text-secondary whitespace-nowrap">{toPersianDigits(star)} ستاره</span>
              <div className="flex-1 h-3 bg-border/60 rounded-pill overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-pill transition-all duration-500 ease-out',
                    isSelected ? 'bg-gold-dark' : 'bg-gold',
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-8 text-left text-text-muted">{toPersianDigits(count)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
