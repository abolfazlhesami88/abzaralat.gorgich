import { ShoppingBag, Heart, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../api/client';
import { formatPrice } from '../../utils/formatPrice';
import { ordersApi } from '../../api/orders.api';
import { OrderStatusBadge } from '../../components/account/OrderStatusBadge';

export function AccountDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: stats } = useQuery({
    queryKey: ['account-dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users/dashboard');
      return data.data;
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['orders', 1],
    queryFn: () => ordersApi.list(1),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-h2 text-text-primary">
        خوش آمدید، {user?.firstName}!
      </h1>

      {/* کارتهای آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'کل سفارشات', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'bg-gold-light text-gold-dark' },
          { label: 'مجموع خرید', value: `${formatPrice(stats?.totalSpent ?? 0)} تومان`, icon: TrendingUp, color: 'bg-success/10 text-success' },
          { label: 'علاقه‌مندی‌ها', value: stats?.wishlistCount ?? 0, icon: Heart, color: 'bg-danger/10 text-danger' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-border rounded-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs text-text-muted">{label}</p>
              <p className="font-bold text-text-primary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* سفارشات اخیر */}
      <div className="bg-white border border-border rounded-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-text-primary">آخرین سفارشات</h2>
          <Link to="/account/orders" className="flex items-center gap-1 text-xs text-gold-dark hover:underline">
            همه سفارشات <ArrowLeft size={14} />
          </Link>
        </div>
        {recentOrders?.items.slice(0, 3).map((order: any) => (
          <Link key={order.id} to={`/account/orders/${order.orderNumber}`}
            className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0 hover:bg-background transition-colors">
            <div>
              <p className="text-sm font-semibold">{order.orderNumber}</p>
              <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
            </div>
            <div className="text-left">
              <OrderStatusBadge status={order.status} />
              <p className="text-xs text-text-secondary mt-1">{formatPrice(order.total)} تومان</p>
            </div>
          </Link>
        ))}
        {(!recentOrders?.items.length) && (
          <p className="text-center text-text-muted text-sm py-8">هنوز سفارشی ثبت نکرده‌اید</p>
        )}
      </div>
    </div>
  );
}
