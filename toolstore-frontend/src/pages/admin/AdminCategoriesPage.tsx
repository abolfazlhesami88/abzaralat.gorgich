import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { DataTable } from '../../components/admin';
import type { Column } from '../../components/admin';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { toast } from 'react-hot-toast';

interface CategoryForm {
  name: string;
  slug: string;
  parentId: string;
  sortOrder: string;
}

const emptyForm: CategoryForm = { name: '', slug: '', parentId: '', sortOrder: '0' };

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(ENDPOINTS.ADMIN.CATEGORIES);
      setCategories(data.data || []);
    } catch {
      toast.error('خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      parentId: cat.parentId || '',
      sortOrder: String(cat.sortOrder ?? 0),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('نام دسته‌بندی الزامی است'); return; }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        parentId: form.parentId || null,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await apiClient.patch(`${ENDPOINTS.ADMIN.CATEGORIES}/${editingId}`, payload);
        toast.success('دسته‌بندی با موفقیت ویرایش شد');
      } else {
        await apiClient.post(ENDPOINTS.ADMIN.CATEGORIES, payload);
        toast.success('دسته‌بندی با موفقیت اضافه شد');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در ذخیره دسته‌بندی');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟ تمام محصولات مرتبط تحت تاثیر قرار می‌گیرند.')) return;
    try {
      await apiClient.delete(`${ENDPOINTS.ADMIN.CATEGORIES}/${id}`);
      toast.success('دسته‌بندی حذف شد');
      fetchCategories();
    } catch {
      toast.error('خطا در حذف دسته‌بندی');
    }
  };

  // فقط دسته‌بندی‌های سطح اول (بدون parent) برای dropdown
  const topLevelCategories = categories.filter((c) => !c.parentId);

  const columns: Column<any>[] = [
    { key: 'name', label: 'نام دسته‌بندی', sortable: true },
    { key: 'slug', label: 'نامک (Slug)' },
    { key: 'parent', label: 'دسته‌بندی پدر', render: (row) => row.parent?.name || '—' },
    { key: 'sortOrder', label: 'ترتیب نمایش' },
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
        <h2 className="text-2xl font-bold text-text-primary">مدیریت دسته‌بندی‌ها</h2>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-4 py-2 rounded-button font-medium transition-colors"
        >
          <Plus size={18} />
          افزودن دسته‌بندی
        </button>
      </div>

      <DataTable columns={columns} data={categories} isLoading={isLoading} />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-card shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-text-primary">
                {editingId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">نام دسته‌بندی *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  placeholder="مثال: ابزار برقی"
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
                  placeholder="مثال: power-tools"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">دسته‌بندی پدر (اختیاری)</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm(f => ({ ...f, parentId: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white"
                >
                  <option value="">ندارد (سطح اول)</option>
                  {topLevelCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">ترتیب نمایش</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none"
                  dir="ltr"
                  min="0"
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
