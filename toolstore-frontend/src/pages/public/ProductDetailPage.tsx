import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { ImageGallery } from '../../components/product-detail/ImageGallery';
import { ProductTabs } from '../../components/product-detail/ProductTabs';
import { Loader2, ShoppingCart, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { toast } from 'react-hot-toast';

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'اصالت کالا', desc: 'ضمانت اصالت برند' },
  { icon: Truck, title: 'تحویل اکسپرس', desc: 'ارسال سریع به سراسر کشور' },
  { icon: RotateCcw, title: 'ضمانت بازگشت', desc: '۷ روز ضمانت بازگشت کالا' },
  { icon: CreditCard, title: 'پرداخت در محل', desc: 'امکان پرداخت حضوری' },
];

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug!);
  const { addToCart, isLoading: isAddingToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  const handleAddToCart = async (productId: string, variantId: string | null, qty: number) => {
    try {
      await addToCart(productId, variantId, qty);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در افزودن به سبد');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--p-accent)' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--p-ink)', marginBottom: 8 }}>محصول یافت نشد</h2>
        <p style={{ color: 'var(--p-gray)', fontSize: 14 }}>ممکن است محصول حذف شده باشد یا آدرس اشتباه باشد.</p>
      </div>
    );
  }

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="p-page" style={{ paddingTop: 24, paddingBottom: 80 }}>
      {/* بردکرامب */}
      <nav style={{ fontSize: 12.5, color: 'var(--p-gray)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--p-gray)', textDecoration: 'none' }}>خانه</Link>
        <span style={{ color: 'var(--p-gray-light)' }}>/</span>
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} style={{ color: 'var(--p-gray)', textDecoration: 'none' }}>
              {product.category.name}
            </Link>
            <span style={{ color: 'var(--p-gray-light)' }}>/</span>
          </>
        )}
        <span style={{ color: 'var(--p-ink)', fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* بلوک عنوان */}
      <div style={{ marginBottom: 32 }}>
        {product.brand && (
          <span style={{ fontSize: 12.5, color: 'var(--p-gray)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            {product.brand.name}
          </span>
        )}
        <h1 style={{ fontSize: 27, fontWeight: 500, lineHeight: 1.5, letterSpacing: '-0.01em', color: 'var(--p-ink)', marginTop: 4 }}>
          {product.name}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {product.reviewCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= Math.round(product.averageRating) ? 'var(--p-accent-deep)' : 'var(--p-gray-light)', fontSize: 14 }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--p-gray)' }}>({product.reviewCount})</span>
            </div>
          )}
          <span style={{ fontSize: 12.5, color: product.stock > 0 ? 'var(--p-ok)' : 'var(--p-gray)' }}>
            {product.stock > 0 ? `موجود در انبار (${product.stock} عدد)` : 'ناموجود'}
          </span>
        </div>
      </div>

      {/* گرید محتوا: گالری + باکس خرید */}
      <div className="p-grid">
        {/* ستون گالری */}
        <div>
          <ImageGallery images={product.images} />

          {/* حقایق سریع */}
          {product.specs && product.specs.length > 0 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              {product.specs.slice(0, 3).map((spec) => (
                <div key={spec.id} style={{ flex: '1 1 0', minWidth: 120, background: 'var(--p-bg-soft)', padding: '12px 16px', borderRadius: 6, fontSize: 12.5 }}>
                  <div style={{ color: 'var(--p-gray)', marginBottom: 2 }}>{spec.specKey}</div>
                  <div style={{ color: 'var(--p-ink)', fontWeight: 600, fontSize: 13.5 }}>{spec.specValue}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ستون باکس خرید */}
        <div className="p-buy-box">
          <div style={{ border: '1px solid var(--p-line)', borderRadius: 8, padding: 24 }}>
            {/* فروشنده */}
            <div style={{ fontSize: 12.5, color: 'var(--p-gray)', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--p-line)' }}>
              فروشگاه ToolStore Pro
            </div>

            {/* قیمت */}
            <div style={{ marginBottom: 20 }}>
              {product.compareAtPrice && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: 'var(--p-gray)', textDecoration: 'line-through' }}>
                    {product.compareAtPrice.toLocaleString('fa-IR')} تومان
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--p-accent-deep)', background: 'var(--p-accent-soft)', padding: '2px 8px', borderRadius: 4 }}>
                    {discountPercent}٪
                  </span>
                </div>
              )}
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--p-ink)' }}>
                {product.price.toLocaleString('fa-IR')} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--p-gray)' }}>تومان</span>
              </div>
            </div>

            {/* تاییدیه‌ها */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                'گارانتی اصالت کالا',
                'ضمانت بازگشت ۷ روزه',
                'پرداخت در محل تحویل',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <ShieldCheck size={14} style={{ color: 'var(--p-ok)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--p-ink)' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* کنترل تعداد + دکمه خرید */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--p-line)', borderRadius: 6, overflow: 'hidden' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--p-ink)' }}
                >
                  −
                </button>
                <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--p-ink)' }}
                >
                  +
                </button>
              </div>
              <button
                className="p-btn-primary"
                style={{ flex: 1 }}
                disabled={product.stock === 0 || isAddingToCart}
                onClick={() => handleAddToCart(product.id, null, quantity)}
              >
                <ShoppingCart size={16} />
                {product.stock === 0 ? 'ناموجود' : isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد'}
              </button>
            </div>

            {/* اطلاعات ارسال */}
            <p style={{ fontSize: 12, color: 'var(--p-gray)', textAlign: 'center' }}>
              ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان
            </p>
          </div>
        </div>
      </div>

      {/* نوار اعتماد */}
      <div style={{ marginTop: 48, marginBottom: 48, borderTop: '1px solid var(--p-line)', borderBottom: '1px solid var(--p-line)', padding: '24px 0' }}>
        <div className="p-trust">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, padding: '0 16px', borderLeft: '1px solid var(--p-line)' }}>
              <item.icon size={22} style={{ color: 'var(--p-ink)' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--p-ink)' }}>{item.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--p-gray)', marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تب‌ها */}
      <ProductTabs product={product} />

      {/* نوار چسبان موبایل */}
      <div className="p-mobile-bar">
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--p-ink)' }}>
            {product.price.toLocaleString('fa-IR')} <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--p-gray)' }}>تومان</span>
          </div>
        </div>
        <button
          className="p-btn-primary"
          style={{ width: 'auto', padding: '10px 20px', fontSize: 13 }}
          disabled={product.stock === 0 || isAddingToCart}
          onClick={() => handleAddToCart(product.id, null, 1)}
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
        </button>
      </div>

      {/* فوتر مینیمال */}
      <footer style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--p-line)', textAlign: 'center', fontSize: 12, color: 'var(--p-gray)' }}>
        ToolStore Pro — فروشگاه تخصصی ابزارآلات
      </footer>
    </div>
  );
}
