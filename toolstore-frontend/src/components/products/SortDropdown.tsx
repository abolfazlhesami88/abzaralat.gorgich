import type { ProductSortBy } from '../../types/product.types';

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'best_selling', label: 'پرفروشترین' },
  { value: 'price_asc', label: 'ارزانترین' },
  { value: 'price_desc', label: 'گرانترین' },
  { value: 'rating', label: 'بهترین امتیاز' },
  { value: 'name_asc', label: 'نام (الفبا)' },
];

export function SortDropdown({ value, onChange }: { value?: ProductSortBy; onChange: (v: string) => void }) {
  return (
    <select
      value={value ?? 'newest'}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-3 text-sm border border-border rounded-button bg-white focus:outline-none focus:border-gold cursor-pointer"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
