import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAllProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../products/ProductGrid';

export function AllProducts() {
  const { data: products, isLoading } = useAllProducts();

  // نمایش حداکثر ۶ محصول در صفحه اصلی
  const displayedProducts = products?.slice(0, 6);

  return (
    <section className="bg-[#fdfcfa] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="section-heading font-display text-h2 text-[#221c12] mb-2 font-bold">
              همه محصولات
            </h2>
            <p className="text-[#8c8272] text-sm md:text-base pr-4 font-normal">
              مجموعه کامل ابزارآلات صنعتی و خانگی با بهترین قیمت
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a67d34] hover:text-[#c79a4b] transition-colors group self-start md:self-auto"
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
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold rounded-2xl shadow-[0_4px_16px_rgba(199,154,75,0.3)] hover:shadow-[0_6px_22px_rgba(199,154,75,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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