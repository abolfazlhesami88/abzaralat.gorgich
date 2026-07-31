import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Tag, X } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { PriceDisplay } from '../../components/shared/PriceDisplay';
import { QuantitySelector } from '../../components/product-detail/QuantitySelector';
import { formatPrice } from '../../utils/formatPrice';
import { getMediaUrl } from '../../utils/media';

export function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, applyCoupon, removeCoupon, appliedCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      await applyCoupon(couponInput.trim().toUpperCase());
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'کد تخفیف معتبر نیست';
      setCouponError(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      await removeCoupon();
    } catch {
      // safe fallback
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (pendingItemId) return;
    setPendingItemId(itemId);
    try {
      await removeItem(itemId);
    } catch {
      // safe fallback
    } finally {
      setPendingItemId(null);
    }
  };

  const handleUpdateQuantity = async (itemId: string, qty: number) => {
    if (pendingItemId) return;
    setPendingItemId(itemId);
    try {
      await updateQuantity(itemId, qty);
    } catch {
      // safe fallback
    } finally {
      setPendingItemId(null);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-border mb-4" />
        <h2 className="font-display text-h2 text-text-primary mb-2">سبد خرید شما خالی است</h2>
        <p className="text-text-secondary mb-6">محصولات مورد نظر خود را به سبد اضافه کنید</p>
        <Link to="/products" className="inline-block bg-gold hover:bg-gold-hover text-text-primary font-bold px-8 py-3 rounded-button transition-colors">
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-h1 text-text-primary mb-8">سبد خرید</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* آیتمهای سبد */}
        <div className="flex-1 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-card p-4 flex gap-4">
              {item.product?.image && (
                <Link to={`/products/${item.product.slug}`}>
                  <img src={getMediaUrl(item.product.image)} alt={item.product.name} className="w-24 h-24 rounded-button object-cover" />
                </Link>
              )}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?.slug ?? ''}`}>
                  <h3 className="font-semibold text-text-primary hover:text-gold-dark line-clamp-2">
                    {item.product?.name}
                  </h3>
                </Link>
                {item.variant && (
                  <p className="text-xs text-text-muted mt-0.5">{item.variant.name}</p>
                )}
                <PriceDisplay price={item.priceAtTime} size="sm" className="mt-1" />
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={pendingItemId === item.id}
                  className="text-text-muted hover:text-danger disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <QuantitySelector
                  quantity={item.quantity}
                  onChange={(q) => handleUpdateQuantity(item.id, q)}
                  max={item.product?.stock ?? 99}
                />
                <p className="font-bold text-sm">{formatPrice(item.totalPrice)} <span className="text-xs font-normal text-text-muted">تومان</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-card p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold text-text-primary">خلاصه سفارش</h2>

            {/* کد تخفیف */}
            {!appliedCoupon ? (
              <div>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="کد تخفیف"
                    className="flex-1 h-10 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 bg-gold-light text-gold-dark rounded-button text-sm font-semibold hover:bg-gold hover:text-text-primary transition-colors disabled:opacity-50"
                  >
                    <Tag size={16} />
                  </button>
                </div>
                {couponError && <p className="text-xs text-danger mt-1">{couponError}</p>}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-success/10 text-success rounded-button px-3 py-2 text-sm">
                <span>کد <strong>{appliedCoupon}</strong> اعمال شد</span>
                <button onClick={handleRemoveCoupon} disabled={couponLoading} className="disabled:opacity-50"><X size={14} /></button>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">جمع کالاها</span>
                <span>{formatPrice(cart.subtotal)} تومان</span>
              </div>
              {(cart.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-success">
                  <span>تخفیف</span>
                  <span>- {formatPrice(cart.discountAmount!)} تومان</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">هزینه ارسال</span>
                <span className={cart.shippingCost === 0 ? 'text-success font-medium' : ''}>
                  {cart.shippingCost === 0 ? 'رایگان' : `${formatPrice(cart.shippingCost)} تومان`}
                </span>
              </div>
              {cart.freeShippingRemaining > 0 && (
                <p className="text-xs text-text-muted">
                  {formatPrice(cart.freeShippingRemaining)} تومان تا ارسال رایگان
                </p>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-border pt-4">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-gold-dark">{formatPrice(cart.total)} <span className="text-xs font-normal">تومان</span></span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gold hover:bg-gold-hover text-text-primary font-bold py-3.5 rounded-button transition-colors"
            >
              تکمیل سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
