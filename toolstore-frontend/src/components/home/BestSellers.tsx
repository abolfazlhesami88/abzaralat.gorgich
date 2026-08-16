import { useBestSellers } from '../../hooks/useProducts';
import { ProductSectionRow } from './ProductSectionRow';

export function BestSellers() {
  const { data: products, isLoading } = useBestSellers();

  return (
    <ProductSectionRow
      title="پرفروش‌ترین‌ها"
      badge="محبوب‌ترین خریداران"
      theme="copper"
      products={products}
      isLoading={isLoading}
      linkTo="/products?sortBy=best_selling"
      ctaType="button"
    />
  );
}
