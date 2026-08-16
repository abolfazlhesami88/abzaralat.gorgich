import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { RatingStars } from '../../components/shared/RatingStars';

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(''); // '' | 'true' | 'false'

  const fetchReviews = async (approved = '') => {
    try {
      setIsLoading(true);
      const url = `${ENDPOINTS.ADMIN.REVIEWS.LIST}${approved ? `?approved=${approved}` : ''}`;
      const { data } = await apiClient.get(url);
      setReviews(data.data.items || []);
    } catch (error) {
      console.error('Error fetching reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(filter);
  }, [filter]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'approve') await apiClient.patch(ENDPOINTS.ADMIN.REVIEWS.APPROVE(id));
      if (action === 'reject') await apiClient.patch(ENDPOINTS.ADMIN.REVIEWS.REJECT(id));
      if (action === 'delete') {
        if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
        await apiClient.delete(ENDPOINTS.ADMIN.REVIEWS.DELETE(id));
      }
      fetchReviews(filter);
    } catch (error) {
      console.error('Error performing action on review', error);
    }
  };

  const columns: Column<any>[] = [
    { key: 'product', label: 'محصول', render: (row) => row.product?.name || '—' },
    { key: 'user', label: 'کاربر', render: (row) => row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() || row.user.phone : 'کاربر مهمان' },
    { key: 'rating', label: 'امتیاز', render: (row) => <RatingStars rating={row.rating} size="sm" /> },
    { key: 'comment', label: 'نظر', render: (row) => <p className="max-w-xs truncate" title={row.comment}>{row.comment}</p> },
    { key: 'createdAt', label: 'تاریخ ثبت', render: (row) => new Date(row.createdAt).toLocaleDateString('fa-IR') },
    { 
      key: 'status', 
      label: 'وضعیت', 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.isApproved ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-800'}`}>
          {row.isApproved ? 'تأیید شده' : 'در انتظار بررسی'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'عملیات', 
      render: (row) => (
        <div className="flex items-center gap-3">
          {!row.isApproved && (
            <button onClick={() => handleAction(row.id, 'approve')} className="text-success hover:text-success/80 transition-colors" title="تأیید نظر">
              <CheckCircle size={18} />
            </button>
          )}
          {row.isApproved && (
            <button onClick={() => handleAction(row.id, 'reject')} className="text-orange-500 hover:text-orange-600 transition-colors" title="رد نظر">
              <XCircle size={18} />
            </button>
          )}
          <button onClick={() => handleAction(row.id, 'delete')} className="text-text-secondary hover:text-danger transition-colors" title="حذف نظر">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت نظرات</h2>
      </div>

      <div className="bg-white p-4 rounded-card border border-border flex items-center gap-4">
        <div className="flex items-center gap-2 text-text-secondary">
          <Filter size={18} />
          <span className="text-sm">فیلتر وضعیت:</span>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-input focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-sm"
        >
          <option value="">همه نظرات</option>
          <option value="false">در انتظار بررسی</option>
          <option value="true">تأیید شده</option>
        </select>
      </div>

      <DataTable 
        columns={columns} 
        data={reviews} 
        isLoading={isLoading} 
      />
    </div>
  );
}
