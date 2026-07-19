import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, CheckCircle, Package } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.ORDERS.DETAIL(id!));
      setOrder(data.data);
      setStatus(data.data.status);
      setTrackingCode(data.data.trackingCode || '');
    } catch (error) {
      console.error('Error fetching order', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      await apiClient.patch(ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(id!), { status, trackingCode });
      alert('وضعیت سفارش با موفقیت بروزرسانی شد.');
      fetchOrder();
    } catch (error) {
      console.error('Error updating order status', error);
      alert('خطا در بروزرسانی وضعیت سفارش');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-text-muted">در حال بارگذاری جزئیات سفارش...</div>;
  if (!order) return <div className="p-8 text-center text-danger">سفارش یافت نشد</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="text-text-secondary hover:text-text-primary p-2">
          <ArrowLeft size={24} className="rotate-180" />
        </Link>
        <h2 className="text-2xl font-bold text-text-primary">
          سفارش {order.orderNumber}
        </h2>
        <span className={`px-3 py-1 text-sm rounded-full ${order.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-800'}`}>
          {order.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار پرداخت'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-card p-6">
            <h3 className="text-lg font-semibold border-b border-border pb-3 mb-4 flex items-center gap-2">
              <Package size={20} className="text-gold" /> اقلام سفارش
            </h3>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
                  <div className="w-16 h-16 bg-background rounded border border-border flex items-center justify-center shrink-0">
                    <Package size={24} className="text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{item.productName}</p>
                    <p className="text-sm text-text-muted mt-1">تعداد: {item.quantity}</p>
                  </div>
                  <div className="text-left font-semibold shrink-0">
                    {formatPrice(item.price * item.quantity)} تومان
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-lg font-bold">
              <span>مبلغ کل سفارش:</span>
              <span className="text-gold-dark">{formatPrice(order.total)} تومان</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-card p-6">
            <h3 className="text-lg font-semibold border-b border-border pb-3 mb-4">آدرس و گیرنده</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <p className="flex items-start gap-2">
                <User size={18} className="shrink-0 text-text-muted" />
                <span className="font-medium text-text-primary">
                  {order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : 'کاربر مهمان'}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Phone size={18} className="shrink-0 text-text-muted" />
                <span dir="ltr">{order.user?.phone || '—'}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin size={18} className="shrink-0 text-text-muted" />
                <span>تهران، آدرس نمونه (از دیتابیس خوانده شود در صورت وجود فیلد)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-border rounded-card p-6">
            <h3 className="text-lg font-semibold border-b border-border pb-3 mb-4">وضعیت سفارش</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">تغییر وضعیت</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white"
                >
                  <option value="pending">در انتظار پرداخت</option>
                  <option value="paid">پرداخت شده</option>
                  <option value="confirmed">تایید شده / در حال آماده‌سازی</option>
                  <option value="shipped">ارسال شده</option>
                  <option value="delivered">تحویل داده شده</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>

              {['shipped', 'delivered'].includes(status) && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">کد رهگیری پستی</label>
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="مثال: 1029384756"
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                    dir="ltr"
                  />
                </div>
              )}

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating || (status === order.status && trackingCode === (order.trackingCode || ''))}
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary py-2 rounded-button font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle size={18} />
                {isUpdating ? 'در حال ثبت...' : 'بروزرسانی وضعیت'}
              </button>
              
              <p className="text-xs text-text-muted text-center mt-2">
                با تغییر وضعیت، برای مشتری اعلان (Notification) ارسال خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
