import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async (q = '', status = '') => {
    try {
      setIsLoading(true);
      let url = `${ENDPOINTS.ADMIN.ORDERS.LIST}?search=${q}`;
      if (status) url += `&status=${status}`;
      const { data } = await apiClient.get(url);
      setOrders(data.data.items || []);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(search, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const columns: Column<any>[] = [
    { key: 'orderNumber', label: 'شماره سفارش' },
    { key: 'createdAt', label: 'تاریخ ثبت', render: (row) => new Date(row.createdAt).toLocaleDateString('fa-IR') },
    { key: 'user', label: 'مشتری', render: (row) => row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() || row.user.phone : 'کاربر مهمان' },
    { key: 'total', label: 'مبلغ کل', render: (row) => formatPrice(row.total) },
    { key: 'paymentStatus', label: 'وضعیت پرداخت', render: (row) => (
      <span className={row.paymentStatus === 'paid' ? 'text-success' : 'text-orange-500'}>
        {row.paymentStatus === 'paid' ? 'پرداخت شده' : 'در انتظار'}
      </span>
    )},
    { 
      key: 'status', 
      label: 'وضعیت ارسال', 
      render: (row) => {
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
      label: 'عملیات', 
      render: (row) => (
        <Link to={`/admin/orders/${row.id}`} className="text-text-secondary hover:text-gold transition-colors">
          <Eye size={18} />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت سفارشات</h2>
      </div>

      <div className="bg-white p-4 rounded-card border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="جستجو با شماره سفارش..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-border rounded-input focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-input focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="pending">در انتظار پرداخت</option>
          <option value="paid">پرداخت شده</option>
          <option value="confirmed">تایید شده</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل داده شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={orders} 
        isLoading={isLoading} 
        onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
      />
    </div>
  );
}
