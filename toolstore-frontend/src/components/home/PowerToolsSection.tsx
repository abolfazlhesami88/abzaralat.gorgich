import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/products.api';
import { ProductSectionRow } from './ProductSectionRow';

export function PowerToolsSection() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products-power-tools'],
    queryFn: async () => {
      const res = await productsApi.list({ limit: 8 });
      return res.items;
    },
  });

  return (
    <ProductSectionRow
      title="ابزار برقی و شارژی"
      badge="قدرت و تکنولوژی"
      theme="blue"
      products={products}
      isLoading={isLoading}
      linkTo="/products"
      ctaType="arrows"
    />
  );
}
