import type { Product } from '../../types/product.types';
import { ProductCard } from '../shared/ProductCard';
import { ProductCardSkeleton } from '../shared/ProductCardSkeleton';
import { FolderSearch } from 'lucide-react';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gold-light rounded-full flex items-center justify-center mb-4 text-gold-dark">
          <FolderSearch size={32} />
        </div>
        <h3 className="font-semibold text-lg text-text-primary mb-2">محصولی یافت نشد</h3>
        <p className="text-sm text-text-secondary">فیلترهای خود را تغییر دهید یا جستجوی دیگری امتحان کنید</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
