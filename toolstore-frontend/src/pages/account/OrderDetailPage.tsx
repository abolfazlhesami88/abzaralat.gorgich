import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, CreditCard, Box, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ordersApi } from '../../api/orders.api';
import { OrderStatusBadge } from '../../components/account/OrderStatusBadge';
import { formatPrice } from '../../utils/formatPrice';

export function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => ordersApi.getDetail(orderNumber!),
    enabled: !!orderNumber,
  });

  const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: () => ordersApi.cancel(orderNumber!),
    onSuccess: () => {
      toast.success('سفارش با موفقیت لغو شد');
      qc.invalidateQueries({ queryKey: ['order', orderNumber] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'خطا در لغو سفارش');
    },
  });

  if (isLoading) return <div className="text-center py-12 text-text-muted">در حال بارگذاری...</div>;
  if (!order) return <div className="text-center py-12 text-danger">سفارش یافت نشد</div>;

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-h2 text-text-primary">سفارش {order.orderNumber}</h1>
        <Link to="/account/orders" className="text-sm font-semibold text-text-secondary hover:text-text-primary flex items-center gap-1">
          بازگشت به سفارشات <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-card p-5 space-y-4">
          <div className="flex items-center gap-3 text-text-primary font-semibold">
            <Box size={20} className="text-gold" />
            وضعیت سفارش
          </div>
          <div>
            <OrderStatusBadge status={order.status} />
            <p className="text-sm mt-3 text-text-secondary">
              ثبت شده در: {new Date(order.createdAt).toLocaleString('fa-IR')}
            </p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-card p-5 space-y-4">
          <div className="flex items-center gap-3 text-text-primary font-semibold">
            <MapPin size={20} className="text-gold" />
            آدرس تحویل
          </div>
          <div className="text-sm text-text-secondary leading-relaxed">
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.province}، {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.addressLine}</p>
            <p>تلفن: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-card p-5 space-y-4">
          <div className="flex items-center gap-3 text-text-primary font-semibold">
            <CreditCard size={20} className="text-gold" />
            اطلاعات پرداخت
          </div>
          <div className="text-sm text-text-secondary space-y-2">
            <div className="flex justify-between">
              <span>مبلغ کل:</span>
              <span className="font-bold text-text-primary">{formatPrice(order.total)} تومان</span>
            </div>
            <div className="flex justify-between">
              <span>وضعیت:</span>
              <span>{order.paymentStatus === 'paid' ? 'پرداخت شده' : 'پرداخت نشده'}</span>
            </div>
            <div className="flex justify-between">
              <span>روش پرداخت:</span>
              <span>{order.paymentMethod === 'card' ? 'آنلاین' : 'در محل'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-card overflow-hidden">
        <h2 className="font-semibold text-text-primary p-5 border-b border-border">اقلام سفارش</h2>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="p-5 flex gap-4">
              {item.productImage && (
                <img src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + item.productImage} alt={item.productName} className="w-20 h-20 rounded-button object-cover" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.productName}</h3>
                {item.variantName && <p className="text-xs text-text-muted mt-1">{item.variantName}</p>}
                <div className="flex justify-between mt-4 text-sm">
                  <span className="text-text-secondary">{item.quantity} عدد x {formatPrice(item.unitPrice)}</span>
                  <span className="font-bold">{formatPrice(item.totalPrice)} تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 bg-background space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">جمع کالاها</span>
            <span>{formatPrice(order.subtotal)} تومان</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-success">
              <span>تخفیف</span>
              <span>- {formatPrice(order.discountAmount)} تومان</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-secondary">هزینه ارسال</span>
            <span>{order.shippingCost === 0 ? 'رایگان' : `${formatPrice(order.shippingCost)} تومان`}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
            <span>مبلغ نهایی</span>
            <span className="text-gold-dark">{formatPrice(order.total)} تومان</span>
          </div>
        </div>
      </div>

      {canCancel && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('آیا از لغو این سفارش اطمینان دارید؟')) cancelOrder();
            }}
            disabled={isCancelling}
            className="flex items-center gap-2 px-6 py-2.5 rounded-button text-danger font-semibold hover:bg-danger/10 transition-colors disabled:opacity-50"
          >
            <XCircle size={18} />
            {isCancelling ? 'در حال لغو...' : 'لغو سفارش'}
          </button>
        </div>
      )}
    </div>
  );
}
