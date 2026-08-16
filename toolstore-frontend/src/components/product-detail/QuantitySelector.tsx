import { Minus, Plus } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatPrice';

export function QuantitySelector({
  quantity, onChange, max = 99,
}: { quantity: number; onChange: (q: number) => void; max?: number }) {
  return (
    <div className="flex items-center border border-border rounded-button overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-gold-light transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="w-12 text-center font-semibold">{toPersianDigits(quantity)}</span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="w-10 h-10 flex items-center justify-center hover:bg-gold-light transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
