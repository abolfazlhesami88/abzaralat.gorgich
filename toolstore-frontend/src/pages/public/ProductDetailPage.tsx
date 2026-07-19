import { useParams } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { ImageGallery } from '../../components/product-detail/ImageGallery';
import { ProductInfo } from '../../components/product-detail/ProductInfo';
import { ProductTabs } from '../../components/product-detail/ProductTabs';
import { RelatedProducts } from '../../components/product-detail/RelatedProducts';
import { Loader2 } from 'lucide-react';

import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug!);
  const { addToCart, isLoading: isAddingToCart } = useCartStore();

  const handleAddToCart = async (productId: string, variantId: string | null, quantity: number) => {
    try {
      await addToCart(productId, variantId, quantity);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در افزودن به سبد');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">محصول یافت نشد</h2>
        <p className="text-text-secondary">ممکن است محصول حذف شده باشد یا آدرس اشتباه باشد.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-6">
        <span>خانه</span>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <span>{product.category.name}</span>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      {/* بخش اصلی محصول */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-5/12 shrink-0">
          <ImageGallery images={product.images} />
        </div>
        <div className="w-full lg:w-7/12">
          <ProductInfo product={product} onAddToCart={handleAddToCart} isAddingToCart={isAddingToCart} />
        </div>
      </div>

      {/* تبهای اطلاعاتی و نظرات */}
      <ProductTabs product={product} />

      {/* محصولات مرتبط */}
      <RelatedProducts slug={product.slug} />
    </div>
  );
}
