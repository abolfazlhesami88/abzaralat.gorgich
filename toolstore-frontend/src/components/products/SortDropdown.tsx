import type { ProductSortBy } from '../../types/product.types';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'best_selling', label: 'پرفروش‌ترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'rating', label: 'بهترین امتیاز' },
  { value: 'name_asc', label: 'نام (الفبا)' },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value?: ProductSortBy;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex items-center gap-1.5">
      <ArrowUpDown size={14} className="text-text-muted pointer-events-none" />
      <select
        value={value ?? 'newest'}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-9 pr-2 pl-6 text-sm text-text-primary bg-transparent focus:outline-none cursor-pointer font-medium"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
