import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product.types';
import { PriceDisplay } from './PriceDisplay';
import { RatingStars } from './RatingStars';
import { Badge } from './Badge';
import { StockStatus } from './StockStatus';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    
    try {
      await addToCart(product.id, null, 1);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در افزودن به سبد');
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-surface border border-border rounded-card overflow-hidden',
        'transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5',
        'hover:border-gold/40',
      )}
    >
      {/* بجها */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {product.isNew && <Badge variant="new">جدید</Badge>}
        {product.compareAtPrice && <Badge variant="sale">حراج</Badge>}
        {product.stock === 0 && <Badge variant="outOfStock">ناموجود</Badge>}
      </div>

      {/* دکمه Wishlist */}
      <button
        onClick={() => onToggleWishlist?.(product)}
        className={cn(
          'absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm',
          'flex items-center justify-center shadow-card transition-colors',
          'hover:bg-gold-light',
        )}
        aria-label="افزودن به علاقهمندیها"
      >
        <Heart
          size={18}
          className={isWishlisted ? 'fill-danger text-danger' : 'text-text-secondary'}
        />
      </button>

      {/* تصویر */}
      <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-gold-light/30">
        {primaryImage ? (
          <img
            src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            بدون تصویر
          </div>
        )}
      </Link>

      {/* محتوا */}
      <div className="p-4">
        {product.brand && (
          <span className="text-xs text-text-muted uppercase tracking-wide">
            {product.brand.name}
          </span>
        )}

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-text-primary mt-1 line-clamp-2 hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.reviewCount > 0 && (
          <div className="mt-1.5">
            <RatingStars rating={product.averageRating} reviewCount={product.reviewCount} size="sm" />
          </div>
        )}

        <div className="mt-3">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>

        <div className="mt-2">
          <StockStatus stock={product.stock} lowStockThreshold={5} />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className={cn(
            'mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-button',
            'font-semibold text-sm transition-colors',
            product.stock === 0
              ? 'bg-gray-100 text-text-muted cursor-not-allowed'
              : 'bg-gold text-text-primary hover:bg-gold-hover',
          )}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
        </button>
      </div>
    </div>
  );
}
