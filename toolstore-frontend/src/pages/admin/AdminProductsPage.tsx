import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async (q = '') => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(`${ENDPOINTS.ADMIN.PRODUCTS.LIST}?search=${q}&limit=500`);
      setProducts(data.data.items || []);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      try {
        await apiClient.delete(ENDPOINTS.ADMIN.PRODUCTS.DELETE(id));
        fetchProducts(search);
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  };

  const columns: Column<any>[] = [
    { 
      key: 'image', 
      label: 'تصویر', 
      width: 'w-16',
      render: (row) => {
        const primaryImage = row.images?.find((i: any) => i.isPrimary) || row.images?.[0];
        return primaryImage ? (
          <img src={primaryImage.url} alt={row.name} className="w-10 h-10 object-cover rounded bg-background" />
        ) : (
          <div className="w-10 h-10 bg-background rounded flex items-center justify-center text-xs text-text-muted">بدون عکس</div>
        );
      }
    },
    { key: 'name', label: 'نام محصول', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'price', label: 'قیمت', render: (row) => formatPrice(row.price), sortable: true },
    { key: 'stock', label: 'موجودی', sortable: true, render: (row) => (
      <span className={row.stock <= row.lowStockThreshold ? 'text-danger font-bold' : ''}>
        {row.stock}
      </span>
    )},
    { key: 'status', label: 'وضعیت', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'active' ? 'bg-success/10 text-success' : row.status === 'archived' ? 'bg-danger/10 text-danger' : 'bg-text-muted/10 text-text-muted'}`}>
        {row.status === 'active' ? 'فعال' : row.status === 'archived' ? 'آرشیو' : 'پیش‌نویس'}
      </span>
    )},
    { 
      key: 'actions', 
      label: 'عملیات', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/admin/products/${row.id}/edit`} className="text-text-secondary hover:text-gold transition-colors">
            <Edit size={18} />
          </Link>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت محصولات</h2>
        <Link 
          to="/admin/products/new" 
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن محصول جدید
        </Link>
      </div>

      <div className="bg-white p-4 rounded-card border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="جستجو در محصولات (نام، SKU)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-border rounded-input focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-button text-text-secondary hover:bg-background transition-colors">
          <Filter size={18} />
          فیلترها
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        isLoading={isLoading} 
        onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
      />
    </div>
  );
}
