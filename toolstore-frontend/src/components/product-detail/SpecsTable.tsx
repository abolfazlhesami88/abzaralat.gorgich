import type { ProductSpec } from '../../types/product.types';

export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  if (!specs.length) {
    return <p className="text-text-muted text-sm">مشخصات فنی برای این محصول ثبت نشده است.</p>;
  }

  return (
    <div className="border border-border rounded-card overflow-hidden">
      {specs.map((spec, i) => (
        <div
          key={spec.id}
          className={`flex ${i % 2 === 0 ? 'bg-background' : 'bg-white'}`}
        >
          <div className="w-1/3 p-3 text-sm font-medium text-text-secondary border-l border-border">
            {spec.specKey}
          </div>
          <div className="flex-1 p-3 text-sm text-text-primary">{spec.specValue}</div>
        </div>
      ))}
    </div>
  );
}
