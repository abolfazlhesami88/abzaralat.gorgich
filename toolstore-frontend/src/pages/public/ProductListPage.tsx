import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useFilterState } from '../../hooks/useFilterState';
import { FilterSidebar } from '../../components/products/FilterSidebar';
import { MobileFilterDrawer } from '../../components/products/MobileFilterDrawer';
import { SortDropdown } from '../../components/products/SortDropdown';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Pagination } from '../../components/products/Pagination';
import { ActiveFilterChips } from '../../components/products/ActiveFilterChips';
import { toPersianDigits } from '../../utils/formatPrice';

export function ProductListPage() {
  const { filters, updateFilter, clearAllFilters, activeFilterCount } = useFilterState();
  const { data, isLoading } = useProducts(filters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-h1 text-text-primary mb-2">همه محصولات</h1>
      {data && (
        <p className="text-sm text-text-secondary mb-6">
          {toPersianDigits(data.meta.total)} محصول یافت شد
        </p>
      )}

      <div className="flex gap-8">
        {/* فیلتر دسکتاپ */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onUpdateFilter={updateFilter} onClearAll={clearAllFilters} />
        </div>

        <div className="flex-1 min-w-0">
          {/* نوار ابزار بالا */}
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
