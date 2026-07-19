import { Link } from 'react-router-dom';
import { useNewArrivals } from '../../hooks/useProducts';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';

export function NewArrivals() {
  const { data: products, isLoading } = useNewArrivals();

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading font-display text-h2 text-text-primary">
            جدیدترین محصولات
          </h2>
          <Link to="/products?sortBy=newest" className="text-sm font-semibold text-gold-dark hover:underline">
            مشاهده همه ←
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products?.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
