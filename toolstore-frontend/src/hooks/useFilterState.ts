import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { ProductQueryParams, ProductSortBy } from '../types/product.types';

export function useFilterState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductQueryParams = useMemo(() => ({
    page: Number(searchParams.get('page')) || 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    categorySlug: searchParams.get('category') ?? undefined,
    brandSlug: searchParams.get('brand') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    inStockOnly: searchParams.get('inStock') === 'true',
    sortBy: (searchParams.get('sort') as ProductSortBy) ?? undefined,
    search: searchParams.get('search') ?? undefined,
  }), [searchParams]);

  const updateFilter = useCallback((key: string, value: string | number | boolean | undefined) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === undefined || value === '' || value === false) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
      // تغییر فیلتر همیشه صفحه را به ۱ برمیگرداند مگر خود page تغییر کند
      if (key !== 'page') next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categorySlug) count++;
    if (filters.brandSlug) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  return { filters, updateFilter, clearAllFilters, activeFilterCount };
}
