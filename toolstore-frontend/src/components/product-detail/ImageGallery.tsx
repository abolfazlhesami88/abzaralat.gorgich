import { useState } from 'react';
import type { ProductImage } from '../../types/product.types';
import { getMediaUrl } from '../../utils/media';

export function ImageGallery({ images }: { images: ProductImage[] }) {
  const sorted = [...images].sort((a) => (a.isPrimary ? -1 : 1));
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (!sorted.length) {
    return (
      <div style={{ aspectRatio: '1/1', background: 'var(--p-bg-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p-gray)', fontSize: 14 }}>
        بدون تصویر
      </div>
    );
  }

  return (
    <div>
      {/* تصویر اصلی */}
      <div style={{ aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden', background: 'var(--p-bg)', border: '1px solid var(--p-line)' }}>
        <img
          key={active?.id ?? activeIndex}
          src={getMediaUrl(active?.url)}
          alt={active?.altText ?? ''}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }}
        />
      </div>

      {/* نقطه‌های تعویض */}
      {sorted.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {sorted.map((_, i) => (
            <button
              key={i}
              type="button"
              className="p-dot"
              data-active={String(i === activeIndex)}
              onClick={() => setActiveIndex(i)}
              aria-label={`تصویر ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
