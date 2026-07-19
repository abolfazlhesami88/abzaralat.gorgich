import { formatPrice } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, size = 'md', className }: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-text-primary', sizeClasses[size])}>
        {formatPrice(price)} <span className="text-xs font-normal text-text-secondary">تومان</span>
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-text-muted line-through">
            {formatPrice(compareAtPrice)}
          </span>
          <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-0.5 rounded-badge">
            {discountPercent}٪ تخفیف
          </span>
        </>
      )}
    </div>
  );
}
