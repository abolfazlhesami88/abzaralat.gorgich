
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/products.api';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';

export function RelatedProducts({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => productsApi.related(slug),
    enabled: !!slug,
  });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="py-16 border-t border-border mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-heading font-display text-h2 text-text-primary">
          محصولات مرتبط
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : data?.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
