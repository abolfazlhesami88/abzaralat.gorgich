import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders.api';
import { OrderStatusBadge } from '../../components/account/OrderStatusBadge';
import { formatPrice } from '../../utils/formatPrice';
import { ShoppingBag } from 'lucide-react';

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => ordersApi.list(page),
  });

  if (isLoading) return <div className="text-center py-12 text-text-muted">در حال بارگذاری...</div>;

  if (!data?.items?.length) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={48} className="mx-auto text-border mb-4" />
        <h2 className="font-semibold text-text-primary mb-2">هنوز سفارشی ندارید</h2>
        <Link to="/products" className="text-gold-dark text-sm font-semibold hover:underline">
          شروع به خرید کنید
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-h2 text-text-primary mb-6">سفارشات من</h1>
      <div className="space-y-4">
        {data.items.map((order) => (
          <Link key={order.id} to={`/account/orders/${order.orderNumber}`} className="block bg-white border border-border rounded-card p-5 hover:border-gold transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-text-primary">{order.orderNumber}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              <div className="flex sm:flex-col justify-between sm:items-end items-center">
                <p className="text-sm text-text-secondary">مبلغ کل:</p>
                <p className="font-bold text-text-primary">{formatPrice(order.total)} تومان</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Simple placeholder */}
      <div className="flex justify-center mt-8 gap-2">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded text-sm disabled:opacity-50">قبلی</button>
        <button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded text-sm disabled:opacity-50">بعدی</button>
      </div>
    </div>
  );
}
