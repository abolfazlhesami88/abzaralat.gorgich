import { useState } from 'react';
import type { ProductImage } from '../../types/product.types';
import { cn } from '../../utils/cn';

export function ImageGallery({ images }: { images: ProductImage[] }) {
  const sorted = [...images].sort((a) => (a.isPrimary ? -1 : 1));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (!sorted.length) {
    return <div className="aspect-square bg-gold-light/30 rounded-card flex items-center justify-center text-text-muted">بدون تصویر</div>;
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-card overflow-hidden bg-gold-light/20 border border-border group">
        <img
          src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + active.url}
          alt={active.altText ?? ''}
          className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'w-16 h-16 shrink-0 rounded-button overflow-hidden border-2 transition-colors',
                i === activeIndex ? 'border-gold' : 'border-border opacity-70 hover:opacity-100',
              )}
            >
              <img src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
