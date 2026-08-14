import { useState, useEffect, useRef } from 'react';
import { Palette, Upload, RefreshCw, ExternalLink, Image as ImageIcon, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { siteSettingsApi } from '../../api/site-settings.api';
import { getMediaUrl } from '../../utils/media';
import { toast } from 'react-hot-toast';

export function AdminDesignPage() {
  const [heroImageUrl, setHeroImageUrl] = useState<string>('/hero_tools.jpg');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetchLoading(true);
    try {
      const settings = await siteSettingsApi.getSettings();
      if (settings.hero_image_url) {
        setHeroImageUrl(settings.hero_image_url);
      }
    } catch {
      // fallback to default
    } finally {
      setFetchLoading(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError('');

    // اعتبارسنجی فرمت شفاف PNG یا WebP
    const allowedTypes = ['image/png', 'image/webp', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setError('فرمت فایل مجاز نیست. لطفاً فایل PNG، WebP یا JPEG آپلود کنید.');
      return;
    }

    // اعتبارسنجی حجم (حداکثر ۵ مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    try {
      const res = await siteSettingsApi.uploadHeroImage(selectedFile);
      setHeroImageUrl(res.hero_image_url);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast.success('تصویر هیرو با موفقیت بروزرسانی شد!');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'خطا در ذخیره‌سازی تصویر هیرو');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('آیا از بازگشت به تصویر پیش‌فرض هیرو اطمینان دارید؟')) return;

    setLoading(true);
    try {
      const res = await siteSettingsApi.resetHeroImage();
      setHeroImageUrl(res.hero_image_url);
      setPreviewUrl(null);
      setSelectedFile(null);
      toast.success('تصویر هیرو به حالت پیش‌فرض بازگشت');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در ریست تصویر');
    } finally {
      setLoading(false);
    }
  };

  const activeDisplayUrl = previewUrl ?? getMediaUrl(heroImageUrl);

  return (
    <div className="space-y-8 select-none">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[20px] border border-[#ece4d3] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#fdfbf7] border border-[#d9b869]/40 flex items-center justify-center text-[#c79a4b]">
            <Palette size={24} />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#221c12]">
              مدیریت طراحی و ظاهر سایت
            </h1>
            <p className="text-xs sm:text-sm text-[#8c8272] mt-0.5 font-medium">
              تنظیمات بصری، رنگ‌بندی و تصاویر بخش‌های مختلف فروشگاه
            </p>
          </div>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#fbf7f0] border border-[#c79a4b]/40 text-[#a67d34] hover:bg-[#c79a4b] hover:text-[#221c12] font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm"
        >
          <span>مشاهده صفحه‌ی اصلی</span>
          <ExternalLink size={16} />
        </a>
      </div>

      {/* کارت اول: مدیریت تصویر هیروی صفحه اصلی */}
      <div className="bg-white rounded-[24px] border border-[#ece4d3] shadow-[0_10px_30px_rgba(34,28,18,0.04)] overflow-hidden">
        {/* عنوان کارت */}
        <div className="p-6 border-b border-[#ece4d3] bg-gradient-to-r from-[#fdfbf7] to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon size={20} className="text-[#c79a4b]" />
            <h2 className="font-bold text-base sm:text-lg text-[#221c12]">
              تصویر هیروی صفحه‌ی اصلی (کارت دو ستونه)
            </h2>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fbf1d9] text-[#a67d34] border border-[#ecd9a8]">
            فرمت شفاف PNG / WebP
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {fetchLoading ? (
            <div className="py-12 text-center text-[#8c8272] font-medium text-sm">
              در حال دریافت تنظیمات...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* بخش آپلود فایل */}
              <div className="space-y-5">
                <label className="block text-sm font-bold text-[#221c12]">
                  انتخاب یا درگ فایل جدید
                </label>

                {/* باکس درگ و دراپ با بوردر طلایی نقطه چین */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-8 rounded-[20px] border-2 border-dashed transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                    isDragOver
                      ? 'border-[#c79a4b] bg-[#fdfbf7] scale-[1.01]'
                      : 'border-[#c79a4b]/40 hover:border-[#c79a4b] bg-[#faf8f4]/60 hover:bg-[#fdfbf7]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/webp, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 rounded-full bg-white border border-[#ece4d3] shadow-sm flex items-center justify-center text-[#c79a4b]">
                    <Upload size={24} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#221c12]">
                      برای آپلود تصویر کلیک کنید یا فایل را اینجا رها کنید
                    </p>
                    <p className="text-xs text-[#8c8272] mt-1 font-normal">
                      تنها پسوند‌های <span className="font-extrabold text-[#a67d34]">PNG</span> و <span className="font-extrabold text-[#a67d34]">WebP</span> (با پس‌زمینه شفاف) | حداکثر ۵ مگابایت
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3.5 rounded-[12px] bg-danger/10 border border-danger/20 text-danger text-xs font-bold">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* پیش‌نمایش پس‌زمینه شطرنجی جهت تست شفافیت (Checkerboard Pattern) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#8c8272] block">
                    تست شفافیت (پس‌زمینه شطرنجی چکربورد):
                  </span>
                  <div className="h-44 w-full rounded-[16px] border border-[#ece4d3] bg-[repeating-conic-gradient(#e5dec9_0_25%,#ffffff_0_50%)] bg-[length:16px_16px] flex items-center justify-center p-4 overflow-hidden relative shadow-inner">
                    <img
                      src={activeDisplayUrl}
                      alt="پیش‌نمایش پس‌زمینه شفاف"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(34,28,18,0.15)]"
                    />
                  </div>
                </div>

                {/* دکمه‌های عملیاتی */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!selectedFile || loading}
                    className="flex-1 h-12 rounded-[13px] bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm shadow-[0_4px_16px_rgba(199,154,75,0.3)] hover:shadow-[0_6px_22px_rgba(199,154,75,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                  >
                    <CheckCircle size={18} />
                    <span>{loading ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات هیرو'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 h-12 rounded-[13px] border border-[#ece4d3] bg-white text-[#8c8272] hover:text-danger hover:border-danger/40 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} />
                    <span>بازگشت به تصویر پیش‌فرض</span>
                  </button>
                </div>
              </div>

              {/* بخش پیش‌نمایش زنده در نسخه شبیه‌سازی‌شده هیرو (Live Hero Card Preview) */}
              <div className="space-y-3">
                <span className="text-sm font-bold text-[#221c12] block">
                  پیش‌نمایش زنده در کارت هیروی واقعی سایت:
                </span>

                <div className="rounded-[20px] p-5 bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#fbf9f4] border border-[#d9b869]/40 shadow-md relative overflow-hidden text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-[11px] font-extrabold mb-3">
                    <ShieldCheck size={13} className="text-[#c79a4b]" />
                    <span>پیش‌نمایش زنده</span>
                  </div>

                  <h3 className="font-display font-extrabold text-lg text-[#221c12] leading-snug mb-1">
                    ابزار حرفه‌ای،
                    <span className="block text-[#a67d34]">کیفیت بی‌نظیر</span>
                  </h3>
                  <p className="text-[11px] text-[#8c8272] mb-4">
                    نمایش ترکیب تصویری ابزار جدید در سمت چپ کارت هیرو
                  </p>

                  <div className="relative h-48 w-full bg-[#faf6ee]/50 border border-[#ece4d3]/80 rounded-[14px] flex items-center justify-center p-3">
                    <img
                      src={activeDisplayUrl}
                      alt="Hero Live Preview"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_18px_25px_rgba(90,70,20,0.22)] -rotate-3 transition-transform duration-300 hover:rotate-0"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-[radial-gradient(ellipse,rgba(90,70,20,0.2),transparent_70%)] blur-[4px]" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ece4d3] flex items-center justify-between text-[11px] text-[#8c8272]">
                    <span className="font-bold text-[#a67d34]">+500 محصول</span>
                    <span className="font-bold text-[#a67d34]">+8 برند</span>
                    <span className="font-bold text-[#a67d34]">+10,000 مشتری</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
