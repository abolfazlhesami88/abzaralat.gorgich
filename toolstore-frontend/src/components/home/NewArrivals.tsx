import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNewArrivals } from '../../hooks/useProducts';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';

export function NewArrivals() {
  const { data: products, isLoading } = useNewArrivals();

  return (
    <section className="bg-background py-16 md:py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="section-heading font-display text-h2 text-text-primary mb-2">
              جدیدترین محصولات
            </h2>
            <p className="text-text-secondary text-sm md:text-base pr-4">
              جدیدترین تجهیزات و ابزارهای ورود جدید به فروشگاه
            </p>
          </div>
          <Link
            to="/products?sortBy=newest"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-gold transition-colors group self-start md:self-auto"
          >
            <span>مشاهده همه</span>
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
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

