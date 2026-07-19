import { Star } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, reviewCount, size = 'md', interactive, onChange }: RatingStarsProps) {
  const sizes = { sm: 14, md: 18, lg: 24 };
  const starSize = sizes[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={cn(!interactive && 'cursor-default')}
          >
            <Star
              size={starSize}
              className={star <= Math.round(rating) ? 'fill-gold text-gold' : 'fill-none text-border'}
            />
          </button>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-text-secondary">
          ({toPersianDigits(reviewCount)})
        </span>
      )}
    </div>
  );
}
