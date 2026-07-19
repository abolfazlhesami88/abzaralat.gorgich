import { useState } from 'react';
import type { Product } from '../../types/product.types';
import { SpecsTable } from './SpecsTable';
import { ReviewsSection } from './ReviewsSection';
import { cn } from '../../utils/cn';

const TABS = [
  { id: 'description', label: 'توضیحات' },
  { id: 'specs', label: 'مشخصات فنی' },
  { id: 'reviews', label: 'نظرات کاربران' },
];

export function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="mt-12">
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-gold text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
            {product.description ?? 'توضیحاتی برای این محصول ثبت نشده است.'}
          </div>
        )}

        {activeTab === 'specs' && <SpecsTable specs={product.specs ?? []} />}

        {activeTab === 'reviews' && <ReviewsSection productSlug={product.slug} productId={product.id} />}
      </div>
    </div>
  );
}
