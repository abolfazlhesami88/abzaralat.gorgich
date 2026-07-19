import { X } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';
import type { ProductQueryParams } from '../../types/product.types';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductQueryParams;
  onUpdateFilter: (key: string, value: any) => void;
  onClearAll: () => void;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onUpdateFilter,
  onClearAll,
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-4 overflow-y-auto animate-slide-up flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="font-semibold text-lg text-text-primary">فیلترها</h2>
          <button onClick={onClose} className="p-2 hover:bg-background rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FilterSidebar filters={filters} onUpdateFilter={onUpdateFilter} onClearAll={onClearAll} />
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gold text-text-primary font-bold rounded-button"
          >
            مشاهده نتایج
          </button>
        </div>
      </div>
    </div>
  );
}
