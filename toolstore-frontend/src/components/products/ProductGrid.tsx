import type { Product } from '../../types/product.types';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';
import { FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../../utils/media';
import { PriceDisplay } from '../shared/PriceDisplay';
import { RatingStars } from '../shared/RatingStars';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlistProductIds, useToggleWishlist } from '../../hooks/useWishlist';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({ products, isLoading, viewMode = 'grid' }: ProductGridProps) {
  const wishlistIds = useWishlistProductIds();
  const toggleWishlist = useToggleWishlist();
  if (isLoading) {
    return (
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 gap-4'
            : 'flex flex-col gap-3',
        )}
      >
        {Array.from({ length: 9 }).map((_, i) =>
          viewMode === 'grid' ? (
            <ProductCardSkeleton key={i} />
          ) : (
            <ProductListItemSkeleton key={i} />
          ),
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gold-light/50 rounded-full flex items-center justify-center mb-5 text-gold-dark">
          <FolderSearch size={36} />
        </div>
        <h3 className="font-bold text-lg text-text-primary mb-2">محصولی یافت نشد</h3>
        <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
          فیلترهای خود را تغییر دهید یا جستجوی دیگری امتحان کنید
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductListItem
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
            onToggleWishlist={() => toggleWishlist.mutate(product.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistIds.includes(product.id)}
          onToggleWishlist={() => toggleWishlist.mutate(product.id)}
        />
      ))}
    </div>
  );
}

function ProductListItem({
  product,
  isWishlisted = false,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = async () => {
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

  return (
    <div className="flex gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200">
      {/* تصویر */}
      <Link to={`/products/${product.slug}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50">
          {primaryImage ? (
            <img
              src={getMediaUrl(primaryImage.url)}
              alt={primaryImage.altText ?? product.name}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs bg-gradient-to-br from-gray-100 to-gray-50">
              بدون تصویر
            </div>
          )}
        </div>
      </Link>

      {/* اطلاعات */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {product.brand && (
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
              {product.brand.name}
            </span>
          )}
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-text-primary mt-0.5 line-clamp-2 hover:text-gold-dark transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.reviewCount > 0 && (
            <div className="mt-1">
              <RatingStars rating={product.averageRating} reviewCount={product.reviewCount} size="sm" />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-3 mt-2">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleWishlist}
              aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg border transition-colors',
                isWishlisted
                  ? 'border-danger/50 bg-danger/5 text-danger'
                  : 'border-border text-text-muted hover:border-gold hover:text-gold-dark',
              )}
            >
              <Heart size={14} className={isWishlisted ? 'fill-danger' : ''} />
            </button>

            {product.stock === 0 ? (
              <span className="text-xs text-gray-400 font-medium">موجودی تمام شده</span>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="btn-add-to-cart"
              >
                <ShoppingCart size={15} />
                افزودن به سبد
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-surface border border-border rounded-2xl animate-pulse">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-5 w-24 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
}
