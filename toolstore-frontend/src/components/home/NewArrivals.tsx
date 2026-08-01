import { useNewArrivals } from '../../hooks/useProducts';
import { ProductSectionRow } from './ProductSectionRow';

export function NewArrivals() {
  const { data: products, isLoading } = useNewArrivals();

  return (
    <ProductSectionRow
      title="جدیدترین محصولات"
      badge="تازه‌رسیده‌ها"
      theme="dark"
      products={products}
      isLoading={isLoading}
      linkTo="/products?sortBy=newest"
      ctaType="arrows"
    />
  );
}
