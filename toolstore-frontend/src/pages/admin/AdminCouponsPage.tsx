import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-hot-toast';

interface CouponForm {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: string;
  minOrderAmount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
}

const emptyForm: CouponForm = {
  code: '',
  type: 'percentage',
  value: '',
  minOrderAmount: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
};

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.COUPONS);
      setCoupons(data.data.items || []);
    } catch {
      toast.error('خطا در دریافت کدهای تخفیف');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: String(coupon.value ?? ''),
      minOrderAmount: String(coupon.minOrderAmount ?? ''),
      usageLimit: String(coupon.usageLimit ?? ''),
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      isActive: coupon.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) { toast.error('کد تخفیف الزامی است'); return; }
    if (!form.value || Number(form.value) <= 0) { toast.error('مقدار تخفیف باید بیشتر از صفر باشد'); return; }
    setIsSaving(true);
    try {
      const payload: Record<string, any> = {
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        isActive: form.isActive,
      };
      if (form.minOrderAmount) payload.minOrderAmount = Number(form.minOrderAmount);
      if (form.usageLimit) payload.usageLimit = Number(form.usageLimit);
      if (form.expiresAt) payload.expiresAt = new Date(form.expiresAt).toISOString();

      if (editingId) {
        await apiClient.patch(`${ENDPOINTS.ADMIN.COUPONS}/${editingId}`, payload);
        toast.success('کد تخفیف با موفقیت ویرایش شد');
      } else {
        await apiClient.post(ENDPOINTS.ADMIN.COUPONS, payload);
        toast.success('کد تخفیف با موفقیت اضافه شد');
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در ذخیره کد تخفیف');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این کد تخفیف اطمینان دارید؟')) return;
    try {
      await apiClient.delete(`${ENDPOINTS.ADMIN.COUPONS}/${id}`);
      toast.success('کد تخفیف حذف شد');
      fetchCoupons();
    } catch {
      toast.error('خطا در حذف کد تخفیف');
    }
  };

  const TYPE_LABELS: Record<string, string> = {
    percentage: 'درصدی',
    fixed: 'مبلغ ثابت',
    free_shipping: 'ارسال رایگان',
  };

  const columns: Column<any>[] = [
    { key: 'code', label: 'کد تخفیف', sortable: true, render: (row) => <span className="font-mono font-bold">{row.code}</span> },
    { key: 'type', label: 'نوع', render: (row) => TYPE_LABELS[row.type] || row.type },
    {
      key: 'value', label: 'مقدار', render: (row) =>
        row.type === 'percentage' ? `%${row.value}` :
        row.type === 'free_shipping' ? 'ارسال رایگان' :
        `${formatPrice(row.value)} تومان`,
    },
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
      ),
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button className="text-text-secondary hover:text-gold transition-colors" onClick={() => openEdit(row)}>
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">مدیریت کدهای تخفیف</h2>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن کد تخفیف
        </button>
      </div>

      <DataTable columns={columns} data={coupons} isLoading={isLoading} />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-card shadow-xl w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">کد تخفیف *</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none font-mono"
                    dir="ltr"
                    placeholder="مثال: SUMMER20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">نوع تخفیف *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(f => ({ ...f, type: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white"
                  >
                    <option value="percentage">درصدی</option>
                    <option value="fixed">مبلغ ثابت (تومان)</option>
                    <option value="free_shipping">ارسال رایگان</option>
                  </select>
                </div>
              </div>

              {form.type !== 'free_shipping' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    مقدار تخفیف * {form.type === 'percentage' ? '(درصد)' : '(تومان)'}
                  </label>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                    dir="ltr"
                    min="1"
                    max={form.type === 'percentage' ? '100' : undefined}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">حداقل مبلغ سفارش</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm(f => ({ ...f, minOrderAmount: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                    dir="ltr"
                    min="0"
                    placeholder="اختیاری"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">محدودیت استفاده (دفعه)</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                    dir="ltr"
                    min="1"
                    placeholder="نامحدود"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">تاریخ انقضا</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-gold"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-text-secondary cursor-pointer">
                  کد تخفیف فعال باشد
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-border rounded-button text-text-secondary hover:bg-background transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gold hover:bg-gold-hover text-text-primary rounded-button font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
