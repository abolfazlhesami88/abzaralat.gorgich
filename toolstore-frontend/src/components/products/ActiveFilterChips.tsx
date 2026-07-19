import { X } from 'lucide-react';
import type { ProductQueryParams } from '../../types/product.types';
import { formatPrice, toPersianDigits } from '../../utils/formatPrice';

interface ActiveFilterChipsProps {
  filters: ProductQueryParams;
  onRemove: (key: string, value: undefined) => void;
}

export function ActiveFilterChips({ filters, onRemove }: ActiveFilterChipsProps) {
  const chips = [];

  if (filters.categorySlug) chips.push({ key: 'category', label: `دسته: ${filters.categorySlug}` });
  if (filters.brandSlug) chips.push({ key: 'brand', label: `برند: ${filters.brandSlug}` });
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatPrice(filters.minPrice * 10) : '0';
    const max = filters.maxPrice ? formatPrice(filters.maxPrice * 10) : 'بی نهایت';
    chips.push({ key: 'price', label: `قیمت: ${min} تا ${max}` });
  }
  if (filters.minRating) chips.push({ key: 'minRating', label: `امتیاز: ${toPersianDigits(filters.minRating)}+` });
  if (filters.inStockOnly) chips.push({ key: 'inStock', label: 'فقط موجودها' });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 px-3 py-1 bg-gold-light/50 text-gold-dark text-xs font-medium rounded-pill"
        >
          {chip.label}
          <button
            onClick={() => {
              if (chip.key === 'price') {
                onRemove('minPrice', undefined);
                onRemove('maxPrice', undefined);
              } else {
                onRemove(chip.key, undefined);
              }
            }}
            className="hover:text-danger transition-colors"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}
