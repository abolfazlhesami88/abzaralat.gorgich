import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';

export function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.BRANDS);
      setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این برند اطمینان دارید؟ تمام محصولات مرتبط تحت تاثیر قرار می‌گیرند.')) {
      try {
        await apiClient.delete(`${ENDPOINTS.ADMIN.BRANDS}/${id}`);
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand', error);
      }
    }
  };

  const columns: Column<any>[] = [
    { 
      key: 'logo', 
      label: 'لوگو', 
      width: 'w-16',
      render: (row) => row.logoUrl ? (
        <img src={row.logoUrl} alt={row.name} className="w-10 h-10 object-contain rounded bg-background p-1" />
      ) : (
        <div className="w-10 h-10 bg-background rounded flex items-center justify-center text-xs text-text-muted">بدون لوگو</div>
      )
    },
    { key: 'name', label: 'نام برند', sortable: true },
    { key: 'slug', label: 'نامک (Slug)' },
    { key: 'originCountry', label: 'کشور سازنده', render: (row) => row.originCountry || '—' },
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
        <h2 className="text-2xl font-bold text-text-primary">مدیریت برندها</h2>
        <button 
          onClick={() => alert('افزودن هنوز پیاده‌سازی نشده است')}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن برند
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={brands} 
        isLoading={isLoading} 
      />
    </div>
  );
}
