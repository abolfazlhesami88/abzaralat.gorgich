import type { ProductSpec } from '../../types/product.types';

export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  if (!specs.length) {
    return (
      <p style={{ color: 'var(--p-gray)', fontSize: 13.5, padding: 32, textAlign: 'center' }}>
        مشخصات فنی برای این محصول ثبت نشده است.
      </p>
    );
  }

  return (
    <div>
      {specs.map((spec) => (
        <div key={spec.id} className="p-spec-row">
          <div className="p-spec-label">{spec.specKey}</div>
          <div className="p-spec-value">{spec.specValue}</div>
        </div>
      ))}
    </div>
  );
}
