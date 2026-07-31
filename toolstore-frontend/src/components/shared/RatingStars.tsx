import { Star } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

interface RatingStarsProps {
  rating: number | string;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({ rating, reviewCount, size = 'md', interactive, onChange }: RatingStarsProps) {
  const numericRating = Number(rating) || 0;
  const sizes = { sm: 13, md: 17, lg: 22 };
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
              className={star <= Math.round(numericRating) ? 'fill-gold text-gold' : 'fill-none text-gray-300'}
            />
          </button>
        ))}
      </div>
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-[11px] text-text-secondary dir-ltr">
          ({toPersianDigits(reviewCount)})
        </span>
      )}
    </div>
  );
}
