import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, MapPin, Plus } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { ordersApi } from '../../api/orders.api';
import { useAddresses } from '../../hooks/useAddresses';
import { formatPrice } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

type Step = 'address' | 'payment' | 'confirm';

const STEPS: { id: Step; label: string }[] = [
  { id: 'address', label: 'آدرس تحویل' },
  { id: 'payment', label: 'روش پرداخت' },
  { id: 'confirm', label: 'تأیید نهایی' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'پرداخت آنلاین با کارت', icon: '💳' },
  { id: 'transfer', label: 'واریز بانکی', icon: '🏦' },
  { id: 'cod', label: 'پرداخت در محل', icon: '🚚' },
];

export function CheckoutPage() {
  const { cart, appliedCoupon, clearLocalCart } = useCartStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('address');
  
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(''); 
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!cart || cart.items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      setError('لطفاً آدرس تحویل را انتخاب کنید');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const order = await ordersApi.checkout({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: appliedCoupon ?? undefined,
        notes: notes || undefined,
      });

      clearLocalCart();
      navigate(`/orders/${order.orderNumber}/success`);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'خطا در ثبت سفارش');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-display text-h1 text-text-primary mb-8">تکمیل سفارش</h1>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border -z-10" />
        {STEPS.map((step, idx) => {
          const stepIndex = STEPS.findIndex(s => s.id === step.id);
          const currentIndex = STEPS.findIndex(s => s.id === currentStep);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = stepIndex === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center bg-background px-4">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors',
                isCompleted ? 'bg-success text-white' : isCurrent ? 'bg-gold text-text-primary border-4 border-gold-light' : 'bg-white border-2 border-border text-text-muted'
              )}>
                {isCompleted ? <CheckCircle size={20} /> : idx + 1}
              </div>
              <span className={cn('text-xs mt-2 font-medium', isCurrent ? 'text-text-primary' : 'text-text-muted')}>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {currentStep === 'address' && (
            <div className="bg-white border border-border rounded-card p-6">
              <h2 className="text-lg font-semibold mb-4">انتخاب آدرس تحویل</h2>
              
              {isAddressesLoading ? (
                <div className="py-8 text-center text-text-muted">در حال بارگذاری آدرس‌ها...</div>
              ) : !addresses?.length ? (
                <div className="text-center py-8 bg-background rounded-card">
                  <p className="text-text-secondary mb-4">شما هنوز آدرسی ثبت نکرده‌اید.</p>
                  <button 
                    onClick={() => navigate('/account/addresses')}
                    className="flex items-center gap-2 mx-auto bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
                  >
                    <Plus size={18} />
                    ثبت آدرس جدید
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id}
                      className={cn(
                        "p-4 border-2 rounded-button cursor-pointer transition-colors relative",
                        selectedAddressId === addr.id 
                          ? "border-gold bg-gold-light/20" 
                          : "border-border hover:border-gold/50"
                      )}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-4 left-4 w-5 h-5 rounded-full border-4 border-gold bg-white" />
                      )}
                      <div className="flex items-start gap-3">
                        <MapPin className={cn("mt-1", selectedAddressId === addr.id ? "text-gold" : "text-text-muted")} size={20} />
                        <div>
                          <h3 className="font-semibold text-text-primary">{addr.label || 'آدرس'} {addr.isDefault && <span className="text-xs bg-gold text-text-primary px-2 rounded-full mr-2">پیش‌فرض</span>}</h3>
                          <p className="text-sm text-text-secondary mt-1">{addr.province}، {addr.city}، {addr.addressLine}</p>
                          <p className="text-xs text-text-muted mt-2">گیرنده: {addr.fullName} | {addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    if (!selectedAddressId) return;
                    setCurrentStep('payment');
                  }}
                  disabled={!selectedAddressId}
                  className="bg-gold hover:bg-gold-hover text-text-primary font-bold px-8 py-3 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تأیید و ادامه
                </button>
              </div>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="bg-white border border-border rounded-card p-6">
              <h2 className="text-lg font-semibold mb-4">انتخاب روش پرداخت</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={cn(
                    'flex items-center gap-4 p-4 border rounded-button cursor-pointer transition-colors',
                    paymentMethod === method.id ? 'border-gold bg-gold-light/20' : 'border-border hover:border-gold'
                  )}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-gold w-4 h-4"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-text-primary">{method.label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('address')}
                  className="border border-border text-text-secondary font-bold px-8 py-3 rounded-button hover:bg-background transition-colors"
                >
                  مرحله قبل
                </button>
                <button
                  onClick={() => setCurrentStep('confirm')}
                  className="bg-gold hover:bg-gold-hover text-text-primary font-bold px-8 py-3 rounded-button transition-colors"
                >
                  تأیید و ادامه
                </button>
              </div>
            </div>
          )}

          {currentStep === 'confirm' && (
            <div className="bg-white border border-border rounded-card p-6">
              <h2 className="text-lg font-semibold mb-4">بررسی نهایی سفارش</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary mb-1">آدرس تحویل:</h3>
                  <p className="text-sm text-text-primary">
                    {addresses?.find(a => a.id === selectedAddressId)?.addressLine ?? 'آدرسی انتخاب نشده است'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary mb-1">روش پرداخت:</h3>
                  <p className="text-sm text-text-primary">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-secondary mb-1 block">توضیحات سفارش (اختیاری):</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-24 p-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold"
                    placeholder="اگر نکته‌ای درباره سفارش دارید اینجا بنویسید..."
                  />
                </div>
              </div>

              {error && <div className="p-3 mb-6 bg-danger/10 text-danger rounded-button text-sm">{error}</div>}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrentStep('payment')}
                  disabled={isSubmitting}
                  className="border border-border text-text-secondary font-bold px-8 py-3 rounded-button hover:bg-background transition-colors disabled:opacity-50"
                >
                  مرحله قبل
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="bg-success hover:bg-success/90 text-white font-bold px-8 py-3 rounded-button transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* خلاصه سبد خرید - همواره نمایش داده می‌شود */}
        <div className="md:w-80 shrink-0">
          <div className="bg-white border border-border rounded-card p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold text-text-primary pb-4 border-b border-border">خلاصه سبد خرید</h2>
            
            <div className="max-h-60 overflow-y-auto space-y-3">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-text-secondary truncate pr-4" title={item.product?.name}>
                    <span className="text-gold-dark font-medium ml-1">{item.quantity}x</span> 
                    {item.product?.name}
                  </span>
                  <span className="font-medium shrink-0">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-border text-sm">
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
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-border pt-4">
              <span>مبلغ نهایی</span>
              <span className="text-gold-dark">{formatPrice(cart.total)} <span className="text-xs font-normal">تومان</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
