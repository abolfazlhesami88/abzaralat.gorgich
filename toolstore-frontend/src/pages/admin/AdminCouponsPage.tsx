import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.COUPONS);
      setCoupons(data.data.items || []);
    } catch (error) {
      console.error('Error fetching coupons', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این کد تخفیف اطمینان دارید؟')) {
      try {
        await apiClient.delete(`${ENDPOINTS.ADMIN.COUPONS}/${id}`);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon', error);
      }
    }
  };

  const columns: Column<any>[] = [
    { key: 'code', label: 'کد تخفیف', sortable: true, render: (row) => <span className="font-mono font-bold">{row.code}</span> },
    { key: 'type', label: 'نوع', render: (row) => row.type === 'percentage' ? 'درصدی' : 'مبلغ ثابت' },
    { key: 'value', label: 'مقدار', render: (row) => row.type === 'percentage' ? `%${row.value}` : `${formatPrice(row.value)} تومان` },
    { key: 'minOrderAmount', label: 'حداقل خرید', render: (row) => row.minOrderAmount ? `${formatPrice(row.minOrderAmount)} تومان` : '—' },
    { key: 'usageLimit', label: 'محدودیت استفاده', render: (row) => row.usageLimit ? `${row.usedCount} / ${row.usageLimit}` : `${row.usedCount} (نامحدود)` },
    { key: 'expiresAt', label: 'تاریخ انقضا', render: (row) => row.expiresAt ? new Date(row.expiresAt).toLocaleDateString('fa-IR') : 'ندارد' },
    { 
      key: 'isActive', 
      label: 'وضعیت', 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-success/10 text-success' : 'bg-text-muted/10 text-text-muted'}`}>
          {row.isActive ? 'فعال' : 'غیرفعال'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'عملیات', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-gold transition-colors" onClick={() => alert('ویرایش هنوز پیاده‌سازی نشده است')}>
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت کدهای تخفیف</h2>
        <button 
          onClick={() => alert('افزودن هنوز پیاده‌سازی نشده است')}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن کد تخفیف
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={coupons} 
        isLoading={isLoading} 
      />
    </div>
  );
}
