import { useWishlist, useToggleWishlist } from '../../hooks/useWishlist';
import { ProductCard } from '../../components/shared/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  if (isLoading) return <div className="text-center py-12 text-text-muted">در حال بارگذاری...</div>;

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart size={48} className="mx-auto text-border mb-4" />
        <h2 className="font-semibold text-text-primary mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
        <Link to="/products" className="text-gold-dark text-sm font-semibold hover:underline">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-h2 text-text-primary mb-6">علاقه‌مندی‌های من</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item: any) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            isWishlisted={true}
            onToggleWishlist={() => toggleWishlist.mutate(item.product.id)}
          />
        ))}
      </div>
    </div>
  );
}
