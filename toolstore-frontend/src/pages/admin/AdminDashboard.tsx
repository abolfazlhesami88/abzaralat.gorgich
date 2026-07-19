import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import { StatCard, DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, revenueRes, ordersRes, stockRes] = await Promise.all([
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.STATS),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.REVENUE + '?period=30d'),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.RECENT_ORDERS),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.LOW_STOCK),
        ]);

        setStats(statsRes.data.data);
        setRevenue(revenueRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setLowStock(stockRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">در حال بارگذاری داشبورد...</div>;
  }

  const orderColumns: Column<any>[] = [
    { key: 'orderNumber', label: 'شماره سفارش' },
    { key: 'createdAt', label: 'تاریخ', render: (row: any) => new Date(row.createdAt).toLocaleDateString('fa-IR') },
    { key: 'total', label: 'مبلغ (تومان)', render: (row: any) => formatPrice(row.total) },
    { 
      key: 'status', 
      label: 'وضعیت', 
      render: (row: any) => {
        const statuses: any = {
          pending: { label: 'در انتظار پرداخت', class: 'bg-orange-100 text-orange-800' },
          paid: { label: 'پرداخت شده', class: 'bg-blue-100 text-blue-800' },
          confirmed: { label: 'تایید شده', class: 'bg-indigo-100 text-indigo-800' },
          shipped: { label: 'ارسال شده', class: 'bg-purple-100 text-purple-800' },
          delivered: { label: 'تحویل داده شده', class: 'bg-green-100 text-green-800' },
          cancelled: { label: 'لغو شده', class: 'bg-red-100 text-red-800' },
        };
        const s = statuses[row.status] || { label: row.status, class: 'bg-gray-100 text-gray-800' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.class}`}>{s.label}</span>;
      }
    },
    { 
      key: 'actions', 
      label: '', 
      render: (row: any) => (
        <Link to={`/admin/orders/${row.id}`} className="text-gold hover:text-gold-hover text-sm flex items-center gap-1">
          جزئیات <ArrowLeft size={14} />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">داشبورد مدیریت</h2>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="سفارشات امروز" 
            value={stats.todayOrders} 
            icon={ShoppingBag} 
            color="blue" 
          />
          <StatCard 
            title="درآمد امروز" 
            value={formatPrice(stats.todayRevenue) + ' تومان'} 
            icon={ShoppingBag} 
            color="success" 
          />
          <StatCard 
            title="مشتریان جدید (امروز)" 
            value={stats.newCustomersToday} 
            icon={Users} 
            color="gold" 
          />
          <StatCard 
            title="سفارشات در انتظار" 
            value={stats.pendingOrders} 
            icon={Package} 
            color="danger" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <div>
          <div className="bg-white border border-border rounded-card p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="text-danger" size={20} />
                هشدارهای موجودی
              </h3>
              <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded-full">
                {lowStock.length} کالا
              </span>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1">
              {lowStock.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">کالایی با موجودی کم یافت نشد.</p>
              ) : (
                lowStock.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-background rounded-button border border-border">
                    <div>
                      <p className="text-sm font-medium text-text-primary line-clamp-1">{product.name}</p>
                      <p className="text-xs text-text-muted mt-1">SKU: {product.sku}</p>
                    </div>
                    <div className="text-center shrink-0 ml-2">
                      <span className={`text-sm font-bold ${product.stock === 0 ? 'text-danger' : 'text-orange-500'}`}>
                        {product.stock}
                      </span>
                      <p className="text-[10px] text-text-muted">موجودی</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {lowStock.length > 0 && (
              <Link to="/admin/products?lowStock=true" className="block text-center text-sm text-gold hover:text-gold-hover mt-4">
                مشاهده همه
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">سفارشات اخیر</h3>
          <Link to="/admin/orders" className="text-sm text-gold hover:text-gold-hover">مشاهده همه سفارشات</Link>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} />
      </div>
    </div>
  );
}
