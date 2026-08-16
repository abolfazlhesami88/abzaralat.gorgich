import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useFilterState } from '../../hooks/useFilterState';
import { useCategory } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/products/ProductGrid';
import { FilterSidebar } from '../../components/products/FilterSidebar';
import { MobileFilterDrawer } from '../../components/products/MobileFilterDrawer';
import { SortDropdown } from '../../components/products/SortDropdown';
import { Pagination } from '../../components/products/Pagination';
import { ActiveFilterChips } from '../../components/products/ActiveFilterChips';
import { toPersianDigits } from '../../utils/formatPrice';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category } = useCategory(slug!);
  const { filters, updateFilter, clearAllFilters, activeFilterCount } = useFilterState();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // قفل کردن دستهبندی روی پارامتر URL، صرفنظر از فیلتر سایدبار
  const queryParams = { ...filters, categorySlug: slug };
  const { data, isLoading } = useProducts(queryParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-xs text-text-muted mb-2">
        <span>خانه</span> / <span className="text-text-primary">{category?.name}</span>
      </nav>
      <h1 className="font-display text-h1 text-text-primary mb-2">{category?.name}</h1>

      <div className="flex gap-8 mt-8">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onUpdateFilter={updateFilter} onClearAll={clearAllFilters} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-button text-sm font-medium"
            >
              <SlidersHorizontal size={16} />
              فیلترها
              {activeFilterCount > 0 && (
                <span className="bg-gold text-text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {toPersianDigits(activeFilterCount)}
                </span>
              )}
            </button>

            <div className="mr-auto">
              <SortDropdown value={filters.sortBy} onChange={(v) => updateFilter('sort', v)} />
            </div>
          </div>

          <ActiveFilterChips filters={filters} onRemove={updateFilter} />

          <ProductGrid products={data?.items} isLoading={isLoading} />
          {data && (
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={(page) => updateFilter('page', page)}
            />
          )}
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onUpdateFilter={updateFilter}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
