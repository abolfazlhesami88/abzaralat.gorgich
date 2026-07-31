import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product.types';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';
import { getMediaUrl } from '../../utils/media';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    try {
      await addToCart(product.id, null, 1);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'خطا در افزودن به سبد';
      toast.error(message);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onToggleWishlist) return;
    try {
      await onToggleWishlist(product);
    } catch {
      // safe fallback
    }
  };

  const isOutOfStock = Number(product.stock) === 0;

  return (
    <div
      className={cn(
        'group relative bg-surface border border-border rounded-card overflow-hidden flex flex-col justify-between h-full',
        'transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-gold/40',
      )}
    >
      <div>
        {/* تصویر + بجها */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <Link to={`/products/${product.slug}`} className="block w-full h-full">
            {primaryImage ? (
              <img
                src={getMediaUrl(primaryImage.url)}
                alt={primaryImage.altText ?? product.name}
                loading="lazy"
                className={cn(
                  'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                  isOutOfStock && 'opacity-60 grayscale-[20%]',
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-xs bg-gray-100">
                بدون تصویر
              </div>
            )}
          </Link>

          {/* بجها */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
            {product.isNew && <Badge variant="new">جدید</Badge>}
            {product.compareAtPrice && !isOutOfStock && <Badge variant="sale">حراج</Badge>}
            {isOutOfStock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-800/80 backdrop-blur-sm text-white">
                موجودی تمام شده
              </span>
            )}
          </div>

          {/* دکمه علاقه مندی */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-card',
              'flex items-center justify-center transition-colors hover:bg-gold-light',
            )}
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-danger text-danger' : 'text-text-secondary'}
            />
          </button>
        </div>

        {/* اطلاعات محصول */}
        <div className="p-4 space-y-2">
          {product.brand && (
            <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
              {product.brand.name}
            </span>
          )}

          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm text-text-primary line-clamp-2 hover:text-gold-dark transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {Number(product.reviewCount) > 0 && (
            <div className="pt-0.5">
              <RatingStars rating={product.averageRating} reviewCount={product.reviewCount} size="sm" />
            </div>
          )}

          <div className="pt-1">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          </div>
        </div>
      </div>

      {/* دکمه افزودن به سبد خرید */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-button text-sm font-semibold transition-all duration-200',
            isOutOfStock
              ? 'bg-gray-100 text-text-muted cursor-not-allowed border border-gray-200'
              : 'bg-gold text-text-primary hover:bg-gold-hover shadow-sm active:scale-95',
          )}
        >
          <ShoppingCart size={16} />
          {isOutOfStock ? 'موجودی تمام شده' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  );
}
