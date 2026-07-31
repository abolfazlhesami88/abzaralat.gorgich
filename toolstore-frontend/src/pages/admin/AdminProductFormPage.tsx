import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowRight, Upload, X } from 'lucide-react';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { getMediaUrl } from '../../utils/media';

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    lowStockThreshold: '',
    categoryId: '',
    brandId: '',
    shortDescription: '',
    description: '',
    status: 'draft',
  });

  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          apiClient.get(ENDPOINTS.ADMIN.CATEGORIES),
          apiClient.get(ENDPOINTS.ADMIN.BRANDS),
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (e) {
        console.error('Error fetching dependencies', e);
      }
    };
    fetchDependencies();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await apiClient.get(ENDPOINTS.ADMIN.PRODUCTS.DETAIL(id!));
          const p = data.data;
          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            price: p.price || '',
            stock: p.stock || '',
            lowStockThreshold: p.lowStockThreshold || '',
            categoryId: p.categoryId || '',
            brandId: p.brandId || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            status: p.status || 'draft',
          });
          setImages(p.images || []);
        } catch (e) {
          console.error('Error fetching product details', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        categoryId: formData.categoryId || undefined,
        brandId: formData.brandId || undefined,
      };

      if (isEdit) {
        await apiClient.patch(ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id!), payload);
        
        // Upload any pending images added during edit
        const pendingImages = images.filter(img => img.isPending);
        for (const img of pendingImages) {
          const formData = new FormData();
          formData.append('file', img.file);
          await apiClient.post(ENDPOINTS.ADMIN.PRODUCTS.UPLOAD_IMAGE(id!), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            params: { primary: img.isPrimary },
          });
        }
        
        alert('محصول با موفقیت ویرایش شد');
      } else {
        const response = await apiClient.post(ENDPOINTS.ADMIN.PRODUCTS.CREATE, payload);
        const newId = response.data.data.id;
        
        // Upload pending images
        const pendingImages = images.filter(img => img.isPending);
        for (const img of pendingImages) {
          const formData = new FormData();
          formData.append('file', img.file);
          await apiClient.post(ENDPOINTS.ADMIN.PRODUCTS.UPLOAD_IMAGE(newId), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            params: { primary: img.isPrimary },
          });
        }
        
        alert('محصول با موفقیت اضافه شد');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error saving product', error);
      alert('خطا در ذخیره محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    if (!isEdit) {
      // Store in state temporarily for new products
      const tempId = URL.createObjectURL(file);
      setImages(prev => [...prev, {
        id: tempId,
        url: tempId,
        isPrimary: prev.length === 0,
        isPending: true,
        file: file
      }]);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await apiClient.post(ENDPOINTS.ADMIN.PRODUCTS.UPLOAD_IMAGE(id!), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { primary: images.length === 0 },
      });
      setImages(prev => [...prev, data.data]);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('آیا از حذف این تصویر اطمینان دارید؟')) return;
    
    const image = images.find(img => img.id === imageId);
    if (image?.isPending) {
      setImages(prev => prev.filter(img => img.id !== imageId));
      return;
    }

    try {
      await apiClient.delete(ENDPOINTS.ADMIN.PRODUCTS.DELETE_IMAGE(id!, imageId));
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-text-muted">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/products')} className="text-text-secondary hover:text-text-primary p-2">
            <ArrowRight size={24} />
          </button>
          <h2 className="text-2xl font-bold text-text-primary">
            {isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}
          </h2>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gold hover:bg-gold-hover text-text-primary px-6 py-2 rounded-button font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSubmitting ? 'در حال ذخیره...' : 'ذخیره محصول'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-card border border-border space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">اطلاعات پایه</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">نام محصول *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">کد محصول (SKU) *</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">توضیحات کوتاه</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">توضیحات کامل (HTML مجاز است)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none resize-y" />
            </div>
          </div>


            <div className="bg-white p-6 rounded-card border border-border space-y-4">
              <h3 className="text-lg font-semibold border-b border-border pb-2 flex items-center justify-between">
                <span>تصاویر محصول</span>
                <label className="cursor-pointer text-sm bg-background hover:bg-gray-200 px-3 py-1 rounded-button transition-colors flex items-center gap-1 text-text-primary">
                  <Upload size={14} /> آپلود تصویر
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </h3>
              
              <div className="flex flex-wrap gap-4">
                {images.length === 0 ? (
                  <p className="text-sm text-text-muted">تصویری آپلود نشده است.</p>
                ) : (
                  images.map(img => {
                    const imageUrl = getMediaUrl(img.url);
                    return (
                      <div key={img.id} className="relative group w-24 h-24 border border-border rounded bg-background p-1">
                        <img src={imageUrl} alt="product" className="w-full h-full object-contain" />
                        {img.isPrimary && <span className="absolute top-0 right-0 bg-gold text-[10px] px-1 rounded-bl">اصلی</span>}
                      <button 
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute -top-2 -left-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
                )}
              </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-card border border-border space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">قیمت و موجودی</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">قیمت فروش (تومان) *</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none" dir="ltr" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">موجودی *</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">هشدار موجودی کم</label>
                <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none" dir="ltr" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-card border border-border space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">دسته‌بندی و وضعیت</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">دسته‌بندی</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white">
                <option value="">انتخاب کنید</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">برند</label>
              <select name="brandId" value={formData.brandId} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white">
                <option value="">انتخاب کنید</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">وضعیت محصول</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-input focus:border-gold outline-none bg-white">
                <option value="draft">پیش‌نویس (Draft)</option>
                <option value="active">فعال (Active)</option>
                <option value="archived">آرشیو (Archived)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
