import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Settings, CheckSquare } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';
import { getMediaUrl } from '../../utils/media';
import toast from 'react-hot-toast';

function BulkEditModal({ 
  isOpen, 
  onClose, 
  selectedCount, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedCount: number; 
  onSubmit: (actionType: string, value: number) => Promise<void>; 
}) {
  const [actionType, setActionType] = useState('SET_DISCOUNT_PERCENT');
  const [value, setValue] = useState<number | ''>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isRemoveDiscount = actionType === 'REMOVE_DISCOUNT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRemoveDiscount && (value === '' || Number(value) < 0)) {
      toast.error('مقدار وارد شده نامعتبر است');
      return;
    }
    try {
      setIsSubmitting(true);
      await onSubmit(actionType, isRemoveDiscount ? 0 : Number(value));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-card w-full max-w-lg p-6 shadow-2xl border border-border">
        <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">
          <Settings className="text-gold" size={22} />
          ویرایش گروهی ({selectedCount} محصول)
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">نوع عملیات گروهی</label>
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                if (e.target.value === 'SET_DISCOUNT_PERCENT' && value === '') {
                  setValue(10);
                }
              }}
              className="w-full px-3 py-2.5 border border-border rounded-input focus:border-gold outline-none bg-white text-sm"
            >
              <optgroup label="🏷️ مدیریت تخفیف‌ها">
                <option value="SET_DISCOUNT_PERCENT">اعمال تخفیف درصدی روی محصولات</option>
                <option value="REMOVE_DISCOUNT">حذف تخفیف و بازگشت به قیمت اصلی</option>
              </optgroup>
              <optgroup label="💰 تغییرات قیمت">
                <option value="PRICE_PERCENT_INC">افزایش قیمت (درصد)</option>
                <option value="PRICE_PERCENT_DEC">کاهش قیمت (درصد)</option>
                <option value="PRICE_FIXED_INC">افزایش قیمت (مبلغ ثابت تومان)</option>
                <option value="PRICE_FIXED_DEC">کاهش قیمت (مبلغ ثابت تومان)</option>
              </optgroup>
              <optgroup label="📦 موجودی انبار">
                <option value="STOCK_ADD">افزایش موجودی</option>
                <option value="STOCK_SET">تنظیم موجودی جدید</option>
              </optgroup>
            </select>
          </div>

          {actionType === 'SET_DISCOUNT_PERCENT' && (
            <div className="p-3 bg-[#fbf9f4] border border-[#d9b869]/30 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-[#a67d34]">انتخاب سریع درصد تخفیف:</label>
              <div className="flex flex-wrap gap-1.5">
                {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setValue(pct)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      value === pct
                        ? 'bg-gold text-text-primary border-gold font-bold shadow-sm'
                        : 'bg-white text-text-secondary border-border hover:border-gold/60'
                    }`}
                  >
                    {pct}٪
                  </button>
                ))}
              </div>
            </div>
          )}

          {isRemoveDiscount ? (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-xs text-danger leading-relaxed">
              با اجرای این عملیات، تمام تخفیف‌های {selectedCount} محصول انتخاب‌شده برداشته شده و قیمت فروش آن‌ها به قیمت اولیه (خط‌خورده) بازمی‌گردد.
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {actionType.includes('PERCENT') ? 'درصد (%)' : actionType.includes('STOCK') ? 'تعداد' : 'مبلغ (تومان)'}
              </label>
              <input
                type="number"
                min="0"
                max={actionType.includes('PERCENT') ? 99 : undefined}
                value={value}
                onChange={(e) => setValue(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-border rounded-input focus:border-gold outline-none text-sm"
                placeholder={actionType.includes('PERCENT') ? 'مثلا 15' : 'مقدار عددی را وارد کنید'}
                dir="ltr"
                required
              />
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-border rounded-button text-text-secondary hover:bg-background text-sm font-medium"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 text-sm font-bold rounded-button transition-colors ${
                isRemoveDiscount
                  ? 'bg-danger text-white hover:bg-danger/90'
                  : 'bg-gold hover:bg-gold-hover text-text-primary'
              }`}
            >
              {isSubmitting ? 'در حال اعمال...' : isRemoveDiscount ? 'حذف تخفیف‌ها' : 'اعمال تغییرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
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
          <img src={getMediaUrl(primaryImage.url)} alt={row.name} className="w-10 h-10 object-cover rounded bg-background" />
        ) : (
          <div className="w-10 h-10 bg-background rounded flex items-center justify-center text-xs text-text-muted">بدون عکس</div>
        );
      }
    },
    { key: 'name', label: 'نام محصول', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    { 
      key: 'price', 
      label: 'قیمت و تخفیف', 
      sortable: true,
      render: (row) => {
        const hasDiscount = Boolean(row.compareAtPrice && Number(row.compareAtPrice) > Number(row.price));
        const discountPercent = hasDiscount
          ? Math.round(((Number(row.compareAtPrice) - Number(row.price)) / Number(row.compareAtPrice)) * 100)
          : null;

        return (
          <div className="flex flex-col">
            <span className="font-bold text-text-primary text-sm">
              {formatPrice(row.price)} <span className="text-[11px] font-normal text-text-muted">تومان</span>
            </span>
            {hasDiscount && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(row.compareAtPrice)}
                </span>
                <span className="bg-danger/10 text-danger text-[10px] font-bold px-1.5 py-0.2 rounded">
                  {discountPercent}٪-
                </span>
              </div>
            )}
          </div>
        );
      }
    },
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
          <Link to={`/admin/products/${row.id}/edit`} className="text-text-secondary hover:text-gold transition-colors" title="ویرایش">
            <Edit size={18} />
          </Link>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="text-text-secondary hover:text-danger transition-colors" title="حذف">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((p) => p.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((prevId) => prevId !== id),
    );
  };

  const handleBulkSubmit = async (actionType: string, value: number) => {
    try {
      const payload = { productIds: selectedIds, actionType, value };
      const { data } = await apiClient.post(ENDPOINTS.ADMIN.PRODUCTS.BULK_EDIT, payload);
      toast.success(`${data.data.updated} محصول با موفقیت بروزرسانی شد`);
      setSelectedIds([]);
      fetchProducts(search);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'خطا در ویرایش گروهی محصولات');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت محصولات</h2>
        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <button
              onClick={() => {
                if (selectedIds.length === products.length) {
                  setSelectedIds([]);
                } else {
                  setSelectedIds(products.map((p) => p.id));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-button text-xs font-medium text-text-secondary hover:bg-background transition-colors"
            >
              <CheckSquare size={16} />
              {selectedIds.length === products.length ? 'لغو انتخاب همه' : 'انتخاب همه محصولات'}
            </button>
          )}
          <Link 
            to="/admin/products/new" 
            className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
          >
            <Plus size={18} />
            افزودن محصول جدید
          </Link>
        </div>
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

      {selectedIds.length > 0 && (
        <div className="bg-gold-light/20 p-4 rounded-card border border-gold/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary">
              {selectedIds.length} محصول انتخاب شده است
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-text-muted hover:text-danger underline"
            >
              لغو انتخاب
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-hover text-text-primary font-bold text-sm rounded-button shadow-sm transition-colors"
            >
              <Settings size={16} />
              عملیات گروهی و تخفیف‌ها
            </button>
          </div>
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={products} 
        isLoading={isLoading} 
        onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />

      <BulkEditModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedIds.length}
        onSubmit={handleBulkSubmit}
      />
    </div>
  );
}
