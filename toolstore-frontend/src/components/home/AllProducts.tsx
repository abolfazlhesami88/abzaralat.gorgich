import { Link } from 'react-router-dom';
import { useAllProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../products/ProductGrid';

export function AllProducts() {
  const { data: products, isLoading } = useAllProducts();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-heading font-display text-h2 text-text-primary">
            همه محصولات
          </h2>
          <Link to="/products" className="text-sm font-semibold text-gold-dark hover:underline">
            مشاهده همه ←
          </Link>
        </div>

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}