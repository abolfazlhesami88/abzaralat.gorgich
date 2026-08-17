import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowRight, Upload, X, Tag, Percent, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import { getMediaUrl } from '../../utils/media';
import { formatPrice } from '../../utils/formatPrice';

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    lowStockThreshold: '',
    categoryId: '',
    brandId: '',
    shortDescription: '',
    description: '',
    status: 'active',
  });

  const [discountPercent, setDiscountPercent] = useState<string>('');
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
          const originalPrice = p.compareAtPrice ? String(p.compareAtPrice) : '';
          const currentPrice = p.price ? String(p.price) : '';
          
          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            price: currentPrice,
            compareAtPrice: originalPrice,
            stock: p.stock !== undefined ? String(p.stock) : '',
            lowStockThreshold: p.lowStockThreshold !== undefined ? String(p.lowStockThreshold) : '',
            categoryId: p.categoryId || '',
            brandId: p.brandId || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            status: p.status || 'draft',
          });

          if (p.compareAtPrice && p.price && Number(p.compareAtPrice) > Number(p.price)) {
            const calculatedPercent = Math.round(
              ((Number(p.compareAtPrice) - Number(p.price)) / Number(p.compareAtPrice)) * 100
            );
            setDiscountPercent(String(calculatedPercent));
          } else {
            setDiscountPercent('');
          }

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
    // خطای فیلد رو پاک می‌کنیم وقتی کاربر تایپ می‌کنه
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // اعمال تخفیف بر اساس درصد وارد شده
  const handleApplyDiscountPercent = (percentVal: number | string) => {
    const percent = Number(percentVal);
    setDiscountPercent(percentVal ? String(percentVal) : '');

    if (!percentVal || isNaN(percent) || percent <= 0) {
      handleRemoveDiscount();
      return;
    }

    const currentCompare = Number(formData.compareAtPrice);
    const currentPrice = Number(formData.price);
    const basePrice = currentCompare > currentPrice ? currentCompare : (currentCompare || currentPrice || 0);

    if (basePrice > 0) {
      const newPrice = Math.round((basePrice * (1 - Math.min(percent, 99) / 100)) / 1000) * 1000;
      setFormData(prev => ({
        ...prev,
        compareAtPrice: String(basePrice),
        price: String(newPrice),
      }));
    }
  };

  // حذف کامل تخفیف و بازگشت به قیمت اصلی
  const handleRemoveDiscount = () => {
    setDiscountPercent('');
    setFormData(prev => {
      const originalPrice = prev.compareAtPrice || prev.price;
      return {
        ...prev,
        price: originalPrice,
        compareAtPrice: '',
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'نام محصول الزامی است';
    if (!formData.sku.trim()) newErrors.sku = 'کد محصول (SKU) الزامی است';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'قیمت باید بیشتر از صفر باشد';
    if (formData.stock === '' || Number(formData.stock) < 0) newErrors.stock = 'موجودی نمی‌تواند منفی باشد';
    if (formData.compareAtPrice && Number(formData.compareAtPrice) <= Number(formData.price)) {
      newErrors.compareAtPrice = 'قیمت قبل از تخفیف باید از قیمت نهایی بیشتر باشد';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock),
        lowStockThreshold: formData.lowStockThreshold ? Number(formData.lowStockThreshold) : 5,
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
        
        toast.success('محصول با موفقیت ویرایش شد');
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
        
        toast.success('محصول با موفقیت اضافه شد');
        navigate('/admin/products');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? 'خطا در ذخیره محصول');
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
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-input focus:border-gold outline-none ${errors.name ? 'border-danger' : 'border-border'}`}
                />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">کد محصول (SKU) *</label>
                <input
                  required
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-input focus:border-gold outline-none ${errors.sku ? 'border-danger' : 'border-border'}`}
                  dir="ltr"
                />
                {errors.sku && <p className="text-xs text-danger mt-1">{errors.sku}</p>}
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
            <h3 className="text-lg font-semibold border-b border-border pb-2 flex items-center justify-between">
              <span>قیمت و تخفیف</span>
              {formData.compareAtPrice && Number(formData.compareAtPrice) > Number(formData.price) && (
                <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag size={12} />
                  {discountPercent ? `${discountPercent}٪ تخفیف` : 'تخفیف‌دار'}
                </span>
              )}
            </h3>
            
            {/* قیمت نهایی فروش */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-text-secondary">قیمت فروش نهایی (تومان) *</label>
                {formData.price && Number(formData.price) > 0 && (
                  <span className="text-xs text-text-muted">
                    {formatPrice(Number(formData.price))} تومان
                  </span>
                )}
              </div>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => {
                  handleChange(e);
                  // اگر قیمت خط خورده داریم، درصد رو مجدد محاسبه کن
                  const newPrice = Number(e.target.value);
                  const compare = Number(formData.compareAtPrice);
                  if (compare && compare > newPrice && newPrice > 0) {
                    setDiscountPercent(String(Math.round(((compare - newPrice) / compare) * 100)));
                  } else {
                    setDiscountPercent('');
                  }
                }}
                className={`w-full px-4 py-2 border rounded-input focus:border-gold outline-none ${errors.price ? 'border-danger' : 'border-border'}`}
                dir="ltr"
                placeholder="مثلا 1500000"
              />
              {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
            </div>

            {/* جعبه تنظیم تخفیف درصدی و قیمت قبل از تخفیف */}
            <div className="p-3.5 bg-[#fbf9f4] border border-[#d9b869]/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#a67d34] flex items-center gap-1">
                  <Percent size={14} /> تنظیم تخفیف درصدی
                </span>
                {(formData.compareAtPrice || discountPercent) && (
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    className="text-[11px] text-danger hover:text-danger/80 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw size={12} />
                    حذف تخفیف
                  </button>
                )}
              </div>

              {/* کلیدهای سریع درصد تخفیف */}
              <div className="flex flex-wrap gap-1.5">
                {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyDiscountPercent(pct)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                      discountPercent === String(pct)
                        ? 'bg-gold text-text-primary border-gold font-bold shadow-sm'
                        : 'bg-white text-text-secondary border-border hover:border-gold/60'
                    }`}
                  >
                    {pct}٪
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* ورودی درصد تخفیف دلخواه */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">درصد تخفیف (٪)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={discountPercent}
                    onChange={(e) => handleApplyDiscountPercent(e.target.value)}
                    placeholder="مثلا 20"
                    className="w-full px-3 py-1.5 text-sm bg-white border border-border rounded-input focus:border-gold outline-none"
                    dir="ltr"
                  />
                </div>

                {/* قیمت اصلی بدون تخفیف */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">قیمت خط‌خورده (تومان)</label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={(e) => {
                      handleChange(e);
                      const compare = Number(e.target.value);
                      const currentPrice = Number(formData.price);
                      if (compare && currentPrice && compare > currentPrice) {
                        setDiscountPercent(String(Math.round(((compare - currentPrice) / compare) * 100)));
                      } else {
                        setDiscountPercent('');
                      }
                    }}
                    placeholder="قیمت قبل تخفیف"
                    className={`w-full px-3 py-1.5 text-sm bg-white border rounded-input focus:border-gold outline-none ${
                      errors.compareAtPrice ? 'border-danger' : 'border-border'
                    }`}
                    dir="ltr"
                  />
                </div>
              </div>
              {errors.compareAtPrice && <p className="text-xs text-danger">{errors.compareAtPrice}</p>}
            </div>
            
            {/* موجودی */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">موجودی انبار *</label>
                <input
                  required
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-input focus:border-gold outline-none ${errors.stock ? 'border-danger' : 'border-border'}`}
                  dir="ltr"
                />
                {errors.stock && <p className="text-xs text-danger mt-1">{errors.stock}</p>}
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
