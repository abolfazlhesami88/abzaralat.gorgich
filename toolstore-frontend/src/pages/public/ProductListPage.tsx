import { useState } from 'react';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useFilterState } from '../../hooks/useFilterState';
import { FilterSidebar } from '../../components/products/FilterSidebar';
import { MobileFilterDrawer } from '../../components/products/MobileFilterDrawer';
import { SortDropdown } from '../../components/products/SortDropdown';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Pagination } from '../../components/products/Pagination';
import { ActiveFilterChips } from '../../components/products/ActiveFilterChips';
import { toPersianDigits } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

export function ProductListPage() {
  const { filters, updateFilter, clearAllFilters, activeFilterCount } = useFilterState();
  const { data, isLoading } = useProducts(filters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-background">
      {/* هدر صفحه */}
      <div className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-display text-2xl font-bold text-text-primary">همه محصولات</h1>
          {data && (
            <p className="text-sm text-text-muted mt-1">
              {toPersianDigits(data.meta.total)} محصول یافت شد
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-7">
          {/* فیلتر دسکتاپ */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onUpdateFilter={updateFilter}
              onClearAll={clearAllFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* نوار ابزار */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-surface border border-border rounded-2xl">
              {/* دکمه فیلتر موبایل */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className={cn(
                  'lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium',
                  'border border-border hover:border-gold hover:text-gold-dark transition-colors',
                  activeFilterCount > 0 && 'border-gold/50 text-gold-dark bg-gold-light/30',
                )}
              >
                <SlidersHorizontal size={15} />
                فیلترها
                {activeFilterCount > 0 && (
                  <span className="bg-gold text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center px-1">
                    {toPersianDigits(activeFilterCount)}
                  </span>
                )}
              </button>

              {/* جداکننده */}
              <div className="lg:hidden h-5 w-px bg-border" />

              {/* ترتیب نمایش */}
              <div className="mr-auto">
                <SortDropdown value={filters.sortBy} onChange={(v) => updateFilter('sort', v)} />
              </div>

              {/* تغییر نمای گرید/لیست */}
              <div className="hidden sm:flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-gold text-white'
                      : 'text-text-muted hover:text-text-primary hover:bg-background',
                  )}
                  aria-label="نمای شبکه‌ای"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-gold text-white'
                      : 'text-text-muted hover:text-text-primary hover:bg-background',
                  )}
                  aria-label="نمای لیستی"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* فیلترهای فعال */}
            <ActiveFilterChips filters={filters} onRemove={updateFilter} />

            {/* گرید محصولات */}
            <ProductGrid products={data?.items} isLoading={isLoading} viewMode={viewMode} />

            {/* صفحه‌بندی */}
            {data && (
              <Pagination
                currentPage={data.meta.page}
                totalPages={data.meta.totalPages}
                onPageChange={(page) => updateFilter('page', page)}
              />
            )}
          </div>
        </div>
      </div>

      {/* فیلتر موبایل */}
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
