import { useState } from 'react';
import type { Product } from '../../types/product.types';
import { SpecsTable } from './SpecsTable';
import { ReviewsSection } from './ReviewsSection';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'توضیحات' },
    { id: 'specs', label: 'مشخصات فنی' },
    { id: 'reviews', label: `نظرات${product.reviewCount ? ` (${product.reviewCount})` : ''}` },
  ];

  // ضدعفونی رندر HTML جهت جلوگیری از XSS
  const sanitizedDescription = product.description ? sanitizeHtml(product.description) : null;

  return (
    <div style={{ marginTop: 48 }}>
      {/* لیست تب‌ها */}
      <div className="p-tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="p-tab-btn"
            data-active={String(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوای تب‌ها */}
      <div style={{ paddingTop: 32 }}>
        {activeTab === 'description' && (
          <div>
            {/* کارت‌های ویژگی */}
            {product.specs && product.specs.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {product.specs.slice(0, 3).map((spec) => (
                  <div key={spec.id} className="p-feature-card">
                    <div style={{ fontSize: 12, color: 'var(--p-gray)', marginBottom: 4 }}>{spec.specKey}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--p-ink)' }}>{spec.specValue}</div>
                  </div>
                ))}
              </div>
            )}

            {/* جمله درشت با خط accent */}
            {product.shortDescription && (
              <div style={{ display: 'flex', gap: 16, marginBottom: 32, padding: '0 16px', borderRight: '3px solid var(--p-accent)' }}>
                <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--p-ink)', lineHeight: 1.7, margin: 0 }}>
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* توضیح کامل — رندر ایمن HTML جهت جلوگیری از XSS */}
            {sanitizedDescription ? (
              <div
                style={{ fontSize: 14, lineHeight: '1.9', color: 'var(--p-gray)' }}
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            ) : (
              <div style={{ fontSize: 14, lineHeight: '1.9', color: 'var(--p-gray)' }}>
                توضیحاتی برای این محصول ثبت نشده است.
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && <SpecsTable specs={product.specs ?? []} />}

        {activeTab === 'reviews' && <ReviewsSection productSlug={product.slug} productId={product.id} />}
      </div>
    </div>
  );
}
