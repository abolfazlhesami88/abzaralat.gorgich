import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, revenueRes, ordersRes, stockRes, productsRes] = await Promise.all([
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.STATS),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.REVENUE + '?period=30d'),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.RECENT_ORDERS),
          apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.LOW_STOCK),
          apiClient.get(ENDPOINTS.ADMIN.PRODUCTS.LIST + '?limit=500'),
        ]);

        setStats(statsRes.data.data);
        setRevenue(revenueRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setLowStock(stockRes.data.data);
        setProducts(productsRes.data.data.items || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="کل محصولات" 
            value={stats.totalProducts} 
            icon={Package} 
            color="primary" 
            trend={{ value: 12, label: "از ماه گذشته" }} 
          />
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
          <StatCard 
            title="محصولات فعال" 
            value={stats.activeProducts} 
            icon={Package} 
            color="success" 
          />
          <StatCard 
            title="مشاهده همه محصولات" 
            value={`+${stats.totalProducts - (stats.activeProducts ?? 0)}`} 
            icon={ArrowLeft} 
            color="blue" 
          />
        </div>
        
        <div className="col-span-full">
          <div className="bg-gradient-to-r from-gold-light/30 to-blue-light/30 rounded-card p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-text-primary">تمام محصولات</h3>
                <p className="text-sm text-text-secondary mt-1">{stats.totalProducts} محصول در سیستم — {stats.activeProducts} فعال</p>
              </div>
              <Link 
                to="/admin/products"
                className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-5 py-2.5 rounded-button font-bold text-sm transition-all duration-200 shadow-elevated hover:shadow-lg"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                مشاهده همه محصولات
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-border hover:border-gold/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
                    <p className="text-xs text-text-muted">کل محصولات</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-border hover:border-success/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{stats.activeProducts}</p>
                    <p className="text-xs text-text-muted">محصولات فعال</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-border hover:border-danger/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-danger">{stats.lowStockCount}</p>
                    <p className="text-xs text-text-muted">کمبود موجودی</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link 
                to="/admin/products"
                className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-all duration-200 text-sm"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3V3z" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                مدیریت تمام محصولات
              </Link>
              
              <Link 
                to="/admin/products/new"
                className="flex items-center gap-2 bg-white border border-border hover:bg-background text-text-primary px-4 py-2 rounded-button font-medium transition-all duration-200 text-sm"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m-7-7h14" />
                </svg>
                افزودن محصول جدید
              </Link>
              
              <Link 
                to="/admin/products?lowStock=true"
                className="flex items-center gap-2 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-button font-medium transition-all duration-200 text-sm"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                محصولات با کمبود موجودی
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* تمام محصولات */}
      <div className="bg-white border border-border rounded-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">همه محصولات ({stats?.totalProducts})</h3>
          <Link to="/admin/products" className="text-sm text-gold hover:text-gold-dark font-medium">
            مشاهده همه ←
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border border-border rounded-button p-3 hover:border-gold/40 transition-colors cursor-pointer" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gold-light/30 rounded overflow-hidden shrink-0">
                  {product.images?.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">بدون عکس</div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                  <p className="text-xs text-text-muted">SKU: {product.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gold">{formatPrice(product.price)}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${product.status === 'active' ? 'bg-success/10 text-success' : product.status === 'archived' ? 'bg-danger/10 text-danger' : 'bg-text-muted/10 text-text-muted'}`}>
                      {product.status === 'active' ? 'فعال' : product.status === 'archived' ? 'آرشیو' : 'پیش‌نویس'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">موجودی: {product.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
