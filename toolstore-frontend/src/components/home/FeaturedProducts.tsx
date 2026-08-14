import { useFeaturedProducts } from '../../hooks/useProducts';
import { ProductSectionRow } from './ProductSectionRow';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <ProductSectionRow
      title="محصولات ویژه"
      badge="پیشنهاد طلایی گرگیج"
      theme="gold"
      products={products}
      isLoading={isLoading}
      linkTo="/products?featured=true"
      ctaType="button"
    />
  );
}
