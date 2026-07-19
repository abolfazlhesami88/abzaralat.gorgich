import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async (q = '') => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(`${ENDPOINTS.ADMIN.CUSTOMERS.LIST}?search=${q}`);
      setCustomers(data.data.items || []);
    } catch (error) {
      console.error('Error fetching customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleToggleActive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiClient.patch(ENDPOINTS.ADMIN.CUSTOMERS.TOGGLE_ACTIVE(id));
      fetchCustomers(search);
    } catch (error) {
      console.error('Error toggling customer status', error);
    }
  };

  const columns: Column<any>[] = [
    { key: 'fullName', label: 'نام مشتری', render: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || '—' },
    { key: 'email', label: 'ایمیل', sortable: true },
    { key: 'phone', label: 'موبایل', sortable: true },
    { key: 'orderCount', label: 'تعداد سفارش', sortable: true },
    { key: 'createdAt', label: 'تاریخ عضویت', render: (row) => new Date(row.createdAt).toLocaleDateString('fa-IR') },
    { 
      key: 'isActive', 
      label: 'وضعیت', 
      render: (row) => (
        <button 
          onClick={(e) => handleToggleActive(row.id, e)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${row.isActive ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-danger/10 text-danger hover:bg-danger/20'}`}
        >
          {row.isActive ? 'فعال' : 'غیرفعال'}
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت مشتریان</h2>
      </div>

      <div className="bg-white p-4 rounded-card border border-border">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="جستجو در مشتریان (نام، ایمیل، موبایل)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-border rounded-input focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={customers} 
        isLoading={isLoading} 
      />
    </div>
  );
}
