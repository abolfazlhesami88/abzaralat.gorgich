import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatPrice';

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  absoluteMax?: number;
}

export function PriceRangeSlider({ minPrice, maxPrice, onChange, absoluteMax = 500000000 }: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(minPrice ?? 0);
  const [localMax, setLocalMax] = useState(maxPrice ?? absoluteMax);

  useEffect(() => {
    setLocalMin(minPrice ?? 0);
    setLocalMax(maxPrice ?? absoluteMax);
  }, [minPrice, maxPrice, absoluteMax]);

  const handleApply = () => {
    onChange(
      localMin > 0 ? localMin : undefined,
      localMax < absoluteMax ? localMax : undefined,
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          value={localMin}
          onChange={(e) => setLocalMin(Number(e.target.value))}
          placeholder="حداقل"
          className="w-full h-9 px-2 text-sm border border-border rounded-button focus:outline-none focus:border-gold"
        />
        <span className="self-center text-text-muted">تا</span>
        <input
          type="number"
          value={localMax}
          onChange={(e) => setLocalMax(Number(e.target.value))}
          placeholder="حداکثر"
          className="w-full h-9 px-2 text-sm border border-border rounded-button focus:outline-none focus:border-gold"
        />
      </div>
      <p className="text-xs text-text-muted">
        {formatPrice(localMin)} تا {formatPrice(localMax)} تومان
      </p>
      <button
        onClick={handleApply}
        className="w-full text-sm font-semibold bg-gold-light text-gold-dark py-2 rounded-button hover:bg-gold hover:text-text-primary transition-colors"
      >
        اعمال فیلتر قیمت
      </button>
    </div>
  );
}
