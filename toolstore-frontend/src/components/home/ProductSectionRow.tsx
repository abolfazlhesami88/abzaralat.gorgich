import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { Product } from '../../types/product.types';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';
import { useWishlistProductIds, useToggleWishlist } from '../../hooks/useWishlist';
import { cn } from '../../utils/cn';

export type SectionTheme = 'gold' | 'blue' | 'copper' | 'dark';

interface ProductSectionRowProps {
  title: string;
  badge?: string;
  theme: SectionTheme;
  products?: Product[];
  isLoading: boolean;
  linkTo: string;
  ctaType?: 'button' | 'arrows';
}

const THEME_STYLES: Record<SectionTheme, {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  arrowHover: string;
}> = {
  gold: {
    gradient: 'from-[#d9b869] via-[#c79a4b] to-[#a67d34]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    arrowHover: 'hover:bg-white hover:text-[#a67d34]',
  },
  blue: {
    gradient: 'from-[#7a9bb5] via-[#4d7294] to-[#33506b]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    arrowHover: 'hover:bg-white hover:text-[#33506b]',
  },
  copper: {
    gradient: 'from-[#d68566] via-[#b86248] to-[#8c4230]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    arrowHover: 'hover:bg-white hover:text-[#8c4230]',
  },
  dark: {
    gradient: 'from-[#7a6d57] via-[#5c5243] to-[#4a4136]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    arrowHover: 'hover:bg-white hover:text-[#4a4136]',
  },
};

export function ProductSectionRow({
  title,
  badge,
  theme,
  products,
  isLoading,
  linkTo,
  ctaType = 'button',
}: ProductSectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const wishlistIds = useWishlistProductIds();
  const toggleWishlist = useToggleWishlist();

  const themeStyle = THEME_STYLES[theme];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-[24px] bg-white border border-[#ece4d3] shadow-[0_12px_36px_rgba(34,28,18,0.04)] overflow-hidden flex flex-col md:flex-row my-8 md:my-10 select-none">
      {/* پنل کناری رنگی (عرض حدود ۲۱۰px در دسکتاپ، بالا در موبایل) */}
      <div
        className={cn(
          'w-full md:w-[210px] shrink-0 p-6 flex flex-col justify-between relative overflow-hidden text-white bg-gradient-to-br min-h-[160px] md:min-h-[400px]',
          themeStyle.gradient,
        )}
      >
        {/* گلوی دکوراتیو شعاعی در گوشه پایین */}
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_70%)] pointer-events-none" />

        {/* بخش بالای پنل کناری */}
        <div className="relative z-10">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md mb-4 shadow-sm border border-white/20">
              <Sparkles size={13} />
              <span>{badge}</span>
            </div>
          )}
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-tight mb-2">
            {title}
          </h2>
        </div>

        {/* بخش پایین پنل کناری (کنتراست بالاتر دکمه مشاهده همه و فلش‌ها) */}
        <div className="relative z-10 pt-4 mt-auto">
          {ctaType === 'button' ? (
            <Link
              to={linkTo}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-[12px] bg-white/28 hover:bg-white hover:text-[#221c12] border border-white/50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all duration-300 backdrop-blur-md"
            >
              <span>مشاهده همه</span>
              <ArrowLeft size={16} />
            </Link>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Link
                to={linkTo}
                className="text-xs font-extrabold text-white hover:underline drop-shadow-sm"
              >
                مشاهده همه
              </Link>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleScroll('right')}
                  className={cn(
                    'w-8.5 h-8.5 rounded-full bg-white/28 border border-white/50 flex items-center justify-center text-white transition-all duration-200 shadow-sm',
                    themeStyle.arrowHover,
                  )}
                  aria-label="قبلی"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => handleScroll('left')}
                  className={cn(
                    'w-8.5 h-8.5 rounded-full bg-white/28 border border-white/50 flex items-center justify-center text-white transition-all duration-200 shadow-sm',
                    themeStyle.arrowHover,
                  )}
                  aria-label="بعدی"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* بخش اسکرول افقی کارتهای محصول بزرگتر شده */}
      <div className="flex-1 relative overflow-hidden p-4.5 sm:p-6 flex items-center bg-[#fdfcfa]/50">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4.5 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[195px] sm:w-[210px] shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))
            : products?.map((product) => (
                <div key={product.id} className="w-[195px] sm:w-[210px] shrink-0">
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist.mutate(product.id)}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
