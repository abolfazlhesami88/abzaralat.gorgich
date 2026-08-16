import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { PriceRangeSlider } from './PriceRangeSlider';
import { RatingStars } from '../shared/RatingStars';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ProductQueryParams } from '../../types/product.types';

interface FilterSidebarProps {
  filters: ProductQueryParams;
  onUpdateFilter: (key: string, value: string | number | boolean | undefined) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ filters, onUpdateFilter, onClearAll }: FilterSidebarProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const hasActiveFilters =
    !!filters.categorySlug ||
    !!filters.brandSlug ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    !!filters.minRating ||
    !!filters.inStockOnly;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-1">
      {/* هدر فیلترها */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text-primary tracking-wide">فیلترها</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-medium text-gold-dark hover:text-text-primary transition-colors px-2 py-0.5 rounded-full hover:bg-gold-light/50"
          >
            پاک کردن همه
          </button>
        )}
      </div>

      {/* فقط کالاهای موجود - toggle کوچک */}
      <label className="flex items-center justify-between w-full p-3 rounded-xl bg-background hover:bg-gold-light/20 transition-colors cursor-pointer group">
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
          فقط کالاهای موجود
        </span>
        <div
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors duration-200 ease-in-out focus:outline-none',
            filters.inStockOnly ? 'bg-gold' : 'bg-gray-200',
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0',
              'transition duration-200 ease-in-out',
              filters.inStockOnly ? 'translate-x-[-16px]' : 'translate-x-0',
            )}
          />
          <input
            type="checkbox"
            className="sr-only"
            checked={filters.inStockOnly ?? false}
            onChange={(e) => onUpdateFilter('inStock', e.target.checked)}
          />
        </div>
      </label>

      <div className="h-px bg-border my-2" />

      {/* دسته‌بندی */}
      <FilterAccordion title="دسته‌بندی" defaultOpen>
        <div className="space-y-0.5">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                onUpdateFilter('category', filters.categorySlug === cat.slug ? undefined : cat.slug)
              }
              className={cn(
                'w-full text-right text-sm px-3 py-2 rounded-lg transition-colors duration-150',
                filters.categorySlug === cat.slug
                  ? 'bg-gold-light text-gold-dark font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <div className="h-px bg-border my-1" />

      {/* برند */}
      <FilterAccordion title="برند">
        <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin">
          {brands?.map((brand) => (
            <button
              key={brand.id}
              onClick={() =>
                onUpdateFilter('brand', filters.brandSlug === brand.slug ? undefined : brand.slug)
              }
              className={cn(
                'w-full text-right text-sm px-3 py-2 rounded-lg transition-colors duration-150 flex items-center gap-2',
                filters.brandSlug === brand.slug
                  ? 'bg-gold-light text-gold-dark font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background',
              )}
            >
              <span
                className={cn(
                  'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
                  filters.brandSlug === brand.slug
                    ? 'border-gold-dark bg-gold-dark'
                    : 'border-border',
                )}
              >
                {filters.brandSlug === brand.slug && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              {brand.name}
            </button>
          ))}
        </div>
      </FilterAccordion>

      <div className="h-px bg-border my-1" />

      {/* بازه قیمت */}
      <FilterAccordion title="محدوده قیمت">
        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={(min, max) => {
            onUpdateFilter('minPrice', min);
            onUpdateFilter('maxPrice', max);
          }}
        />
      </FilterAccordion>

      <div className="h-px bg-border my-1" />

      {/* امتیاز */}
      <FilterAccordion title="حداقل امتیاز">
        <div className="space-y-0.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                onUpdateFilter('minRating', filters.minRating === rating ? undefined : rating)
              }
              className={cn(
                'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-colors duration-150',
                filters.minRating === rating
                  ? 'bg-gold-light text-gold-dark font-semibold'
                  : 'hover:bg-background',
              )}
            >
              <RatingStars rating={rating} size="sm" />
              <span className="text-xs text-text-muted">به بالا</span>
            </button>
          ))}
        </div>
      </FilterAccordion>
    </aside>
  );
}

function FilterAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-1 py-2 text-sm font-semibold text-text-primary hover:text-gold-dark transition-colors"
      >
        {title}
        <ChevronDown
          size={15}
          className={cn(
            'text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}
