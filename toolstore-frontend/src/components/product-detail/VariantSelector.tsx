import type { ProductVariant } from '../../types/product.types';
import { cn } from '../../utils/cn';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (v: ProductVariant) => void;
}

export function VariantSelector({ variants, selected, onSelect }: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-primary mb-2">انتخاب نوع</h4>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            disabled={v.stock === 0}
            onClick={() => onSelect(v)}
            className={cn(
              'px-4 py-2 rounded-button border text-sm font-medium transition-colors',
              selected?.id === v.id
                ? 'border-gold bg-gold-light text-text-primary'
                : 'border-border hover:border-gold',
              v.stock === 0 && 'opacity-40 cursor-not-allowed line-through',
            )}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}
