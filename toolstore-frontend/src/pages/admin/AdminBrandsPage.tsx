import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { toast } from 'react-hot-toast';

interface BrandForm {
  name: string;
  slug: string;
  originCountry: string;
  logoUrl: string;
}

const emptyForm: BrandForm = { name: '', slug: '', originCountry: '', logoUrl: '' };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BrandForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.BRANDS);
      setBrands(data.data || []);
    } catch {
      toast.error('خطا در دریافت برندها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (brand: any) => {
    setEditingId(brand.id);
    setForm({
      name: brand.name || '',
      slug: brand.slug || '',
      originCountry: brand.originCountry || '',
      logoUrl: brand.logoUrl || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('نام برند الزامی است'); return; }
    setIsSaving(true);
    try {
      if (editingId) {
        await apiClient.patch(`${ENDPOINTS.ADMIN.BRANDS}/${editingId}`, form);
        toast.success('برند با موفقیت ویرایش شد');
      } else {
        await apiClient.post(ENDPOINTS.ADMIN.BRANDS, { ...form, slug: form.slug || slugify(form.name) });
        toast.success('برند با موفقیت اضافه شد');
      }
      setModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در ذخیره برند');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این برند اطمینان دارید؟')) return;
    try {
      await apiClient.delete(`${ENDPOINTS.ADMIN.BRANDS}/${id}`);
      toast.success('برند حذف شد');
      fetchBrands();
    } catch {
      toast.error('خطا در حذف برند');
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
      ),
    },
    { key: 'name', label: 'نام برند', sortable: true },
    { key: 'slug', label: 'نامک (Slug)' },
    { key: 'originCountry', label: 'کشور سازنده', render: (row) => row.originCountry || '—' },
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
        <h2 className="text-2xl font-bold text-text-primary">مدیریت برندها</h2>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن برند
        </button>
      </div>

      <DataTable columns={columns} data={brands} isLoading={isLoading} />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-card shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'ویرایش برند' : 'افزودن برند جدید'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">نام برند *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  placeholder="مثال: بوش"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">نامک (Slug)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  dir="ltr"
                  placeholder="مثال: bosch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">کشور سازنده</label>
                <input
                  type="text"
                  value={form.originCountry}
                  onChange={(e) => setForm(f => ({ ...f, originCountry: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  placeholder="مثال: آلمان"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">آدرس URL لوگو</label>
                <input
                  type="text"
                  value={form.logoUrl}
                  onChange={(e) => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  dir="ltr"
                  placeholder="https://..."
                />
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
