import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAllProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../products/ProductGrid';

export function AllProducts() {
  const { data: products, isLoading } = useAllProducts();

  // نمایش حداکثر ۶ محصول در صفحه اصلی
  const displayedProducts = products?.slice(0, 6);

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="section-heading font-display text-h2 text-text-primary mb-2">
              همه محصولات
            </h2>
            <p className="text-text-secondary text-sm md:text-base pr-4">
              مجموعه کامل ابزارآلات صنعتی و خانگی با بهترین قیمت
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-gold transition-colors group self-start md:self-auto"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={displayedProducts} isLoading={isLoading} />

        {/* دکمه مشاهده همه محصولات در پایین بخش */}
        {products && products.length > 6 && (
          <div className="mt-10 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-white font-semibold rounded-2xl hover:bg-gold-hover hover:shadow-lg transition-all duration-200"
            >
              <span>مشاهده همه محصولات ({products.length})</span>
              <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}