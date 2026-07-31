import { formatPrice } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

interface PriceDisplayProps {
  price: number | string;
  compareAtPrice?: number | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, size = 'md', className }: PriceDisplayProps) {
  const numPrice = Number(price) || 0;
  const numCompare = compareAtPrice ? Number(compareAtPrice) : null;
  const hasDiscount = !!(numCompare && numCompare > numPrice);
  const discountPercent = hasDiscount
    ? Math.round(((numCompare - numPrice) / numCompare) * 100)
    : null;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base md:text-lg',
    lg: 'text-xl md:text-2xl',
  };

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-text-primary', sizeClasses[size])}>
        {formatPrice(numPrice)} <span className="text-xs font-normal text-text-secondary">تومان</span>
      </span>
      {hasDiscount && numCompare && (
        <>
          <span className="text-xs text-text-muted line-through">
            {formatPrice(numCompare)}
          </span>
          <span className="bg-danger/10 text-danger text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">
            {discountPercent}٪
          </span>
        </>
      )}
    </div>
  );
}
