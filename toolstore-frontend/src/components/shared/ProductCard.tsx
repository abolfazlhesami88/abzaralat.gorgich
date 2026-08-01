import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import type { Product } from '../../types/product.types';
import { RatingStars } from './RatingStars';
import { cn } from '../../utils/cn';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';
import { getMediaUrl } from '../../utils/media';
import { formatPrice } from '../../utils/formatPrice';

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
  const numPrice = Number(product.price) || 0;
  const numCompare = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = !!(numCompare && numCompare > numPrice && !isOutOfStock);
  const discountPercent = hasDiscount && numCompare
    ? Math.round(((numCompare - numPrice) / numCompare) * 100)
    : null;

  return (
    <div
      className={cn(
        'group relative bg-white border border-[#f0e9d8] rounded-[20px] overflow-hidden flex flex-col justify-between h-full select-none',
        'shadow-[0_10px_24px_-18px_rgba(90,70,20,0.18)] transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(199,154,75,0.22)] hover:border-[#c79a4b]/50',
      )}
    >
      <div>
        {/* ۱. ناحیه تصویر با ارتفاع بزرگتر (۱۸۵px - ۱۹۵px) و پس‌زمینه کرمی/بژ */}
        <div className="relative h-[185px] sm:h-[195px] w-full overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#f7f2e7] border-b border-[#f0e9d8]/60 flex items-center justify-center p-3.5">
          <Link to={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
            {primaryImage ? (
              <img
                src={getMediaUrl(primaryImage.url)}
                alt={primaryImage.altText ?? product.name}
                loading="lazy"
                className={cn(
                  'max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(34,28,18,0.08)]',
                  isOutOfStock && 'opacity-60 grayscale-[20%]',
                )}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8c8272] text-xs font-medium">
                بدون تصویر
              </div>
            )}
          </Link>

          {/* بج‌های وضعیت محصول (گوشه بالا-راست) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[11px] font-extrabold bg-[#fde8e8] text-[#d93838] border border-[#f8b4b4]/40 shadow-sm">
                حراج
              </span>
            )}
            {product.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[11px] font-extrabold bg-[#f7f2e7] text-[#a67d34] border border-[#d9b869]/40 shadow-sm">
                جدید
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[11px] font-bold bg-[#f0ebe1] text-[#8c8272] border border-[#ded7c8] shadow-sm">
                تمام شد
              </span>
            )}
          </div>

          {/* دکمه علاقه‌مندی (گوشه بالا-چپ) */}
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-[#ece4d3] shadow-sm',
              'flex items-center justify-center transition-all duration-200 hover:bg-white hover:border-[#e55353]/50 group/btn',
            )}
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart
              size={15}
              className={cn(
                'transition-all duration-200',
                isWishlisted
                  ? 'fill-[#e55353] text-[#e55353]'
                  : 'text-[#8c8272] group-hover/btn:text-[#e55353] group-hover/btn:scale-110',
              )}
            />
          </button>
        </div>

        {/* ۲. بدنه کارت (اطلاعات محصول با پدینگ بزرگتر) */}
        <div className="p-4 sm:p-4.5 space-y-2.5">
          {/* نام برند */}
          {product.brand && (
            <span className="text-[10px] font-extrabold text-[#8c8272] uppercase tracking-wider block -mb-1">
              {product.brand.name}
            </span>
          )}

          {/* عنوان محصول */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-sm text-[#221c12] line-clamp-2 hover:text-[#c79a4b] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* امتیاز و نظرات (با ارقام لاتین) */}
          {Number(product.reviewCount) > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <RatingStars rating={product.averageRating} size="sm" />
              <span className="text-[11px] text-[#8c8272] font-medium">({product.reviewCount})</span>
            </div>
          )}

          {/* ۵. چیدمان و ساختار قیمت‌ها با فواصل منظم و ارقام لاتین */}
          <div className="pt-1">
            {hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#8c8272] line-through font-normal">
                    {formatPrice(numCompare!)}
                  </span>
                  <span className="bg-[#fde8e8] text-[#d93838] border border-[#f8b4b4]/40 text-[11px] font-extrabold px-1.5 py-0.5 rounded-[6px]">
                    %{discountPercent}
                  </span>
                </div>
                <div className="font-extrabold text-base sm:text-lg text-[#221c12]">
                  {formatPrice(numPrice)} <span className="text-xs font-normal text-[#8c8272]">تومان</span>
                </div>
              </div>
            ) : (
              <div className="font-extrabold text-base sm:text-lg text-[#221c12] pt-1">
                {formatPrice(numPrice)} <span className="text-xs font-normal text-[#8c8272]">تومان</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ۳. دکمه افزودن به سبد (یک خطی و بدون شکستگی) */}
      <div className="p-4 sm:p-4.5 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="btn-add-to-cart w-full whitespace-nowrap shrink-0"
        >
          <ShoppingCart size={16} className="shrink-0" />
          <span className="whitespace-nowrap">
            {isOutOfStock ? 'موجودی تمام شد' : isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد'}
          </span>
        </button>
      </div>
    </div>
  );
}
