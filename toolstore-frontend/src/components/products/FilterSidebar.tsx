import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { PriceRangeSlider } from './PriceRangeSlider';
import { RatingStars } from '../shared/RatingStars';
import type { ProductQueryParams } from '../../types/product.types';

interface FilterSidebarProps {
  filters: ProductQueryParams;
  onUpdateFilter: (key: string, value: any) => void;
  onClearAll: () => void;
}

export function FilterSidebar({ filters, onUpdateFilter, onClearAll }: FilterSidebarProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">فیلترها</h3>
        <button onClick={onClearAll} className="text-xs text-gold-dark hover:underline">
          حذف همه
        </button>
      </div>

      {/* دستهبندی */}
      <FilterGroup title="دستهبندی">
        <div className="space-y-2">
          {categories?.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={filters.categorySlug === cat.slug}
                onChange={() => onUpdateFilter('category', cat.slug)}
                className="accent-gold"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* برند */}
      <FilterGroup title="برند">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands?.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brandSlug === brand.slug}
                onChange={() =>
                  onUpdateFilter('brand', filters.brandSlug === brand.slug ? undefined : brand.slug)
                }
                className="accent-gold rounded"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* بازه قیمت */}
      <FilterGroup title="محدوده قیمت">
        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={(min, max) => {
            onUpdateFilter('minPrice', min);
            onUpdateFilter('maxPrice', max);
          }}
        />
      </FilterGroup>

      {/* امتیاز */}
      <FilterGroup title="حداقل امتیاز">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onUpdateFilter('minRating', filters.minRating === rating ? undefined : rating)}
              className={`flex items-center gap-2 w-full p-1.5 rounded-button transition-colors ${
                filters.minRating === rating ? 'bg-gold-light' : 'hover:bg-background'
              }`}
            >
              <RatingStars rating={rating} size="sm" />
              <span className="text-xs text-text-secondary">به بالا</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* موجودی */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly ?? false}
          onChange={(e) => onUpdateFilter('inStock', e.target.checked)}
          className="accent-gold rounded"
        />
        <span className="text-sm text-text-secondary">فقط کالاهای موجود</span>
      </label>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-6 border-b border-border last:border-0">
      <h4 className="text-sm font-semibold text-text-primary mb-3">{title}</h4>
      {children}
    </div>
  );
}
