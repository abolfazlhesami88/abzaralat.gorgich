import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Wrench, Hammer, Compass, Settings, Zap, Shield } from 'lucide-react';
import { siteSettingsApi } from '../../api/site-settings.api';
import { getMediaUrl } from '../../utils/media';

export function HeroSection() {
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    siteSettingsApi
      .getSettings()
      .then((settings) => {
        if (settings.hero_image_url) {
          setHeroImageUrl(settings.hero_image_url);
        } else {
          setHeroImageUrl('/hero_tools.jpg');
        }
      })
      .catch(() => {
        setHeroImageUrl('/hero_tools.jpg');
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <section className="relative bg-[#fdfcfa] text-[#221c12] py-10 sm:py-14 md:py-16 px-4 sm:px-6 overflow-hidden select-none">
      {/* استایل انیمیشن‌های شناور ملایم */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(6deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(18px) rotate(-8deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-5deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(7deg); }
        }
        .animate-float-1 { animation: float-1 9s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 11s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-3 8.5s ease-in-out infinite 0.5s; }
        .animate-float-4 { animation: float-4 10s ease-in-out infinite 1.5s; }
      `}</style>

      {/* ۲ هاله شعاعی طلایی کمرنگ در گوشه‌ها برای عمق ظریف */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(217,184,105,0.14)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(199,154,75,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* آیکون‌های خطی شناور در پس‌زمینه (opacity ۱۵٪، طلایی تیره) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        <div className="absolute top-[8%] left-[4%] text-[#a67d34] opacity-15 animate-float-1">
          <Wrench size={56} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[10%] right-[4%] text-[#a67d34] opacity-15 animate-float-2">
          <Hammer size={52} strokeWidth={1.2} />
        </div>
        <div className="absolute bottom-[10%] left-[5%] text-[#a67d34] opacity-15 animate-float-3">
          <Compass size={54} strokeWidth={1.2} />
        </div>
        <div className="absolute bottom-[12%] right-[4%] text-[#a67d34] opacity-15 animate-float-4">
          <Settings size={60} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[48%] left-[2%] text-[#a67d34] opacity-15 animate-float-2">
          <Zap size={44} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[50%] right-[2%] text-[#a67d34] opacity-15 animate-float-3">
          <Shield size={48} strokeWidth={1.2} />
        </div>
      </div>

      {/* کارت شناور مرکزی هیرو */}
      <div className="relative z-10 w-full max-w-[1020px] mx-auto rounded-[28px] p-6 sm:p-10 md:p-12 bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#fbf9f4] border border-[#d9b869]/35 shadow-[0_20px_50px_rgba(34,28,18,0.06),0_2px_12px_rgba(199,154,75,0.08)] overflow-hidden">
        {/* نوار نور ظریف بالایی (Inset Highlight) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b869]/40 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10 text-right">
          {/* ستون محتوا (متن، دکمه‌ها و آمار) */}
          <div className="flex-[1.1] w-full flex flex-col">
            {/* بج پرکنتراست اصالت و کیفیت */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs sm:text-sm font-extrabold mb-5 shadow-[0_2px_6px_rgba(150,110,30,0.08)] self-start">
              <ShieldCheck size={16} className="text-[#c79a4b]" />
              <span>بیش از ۵۰۰ محصول اصل و گارانتی‌دار</span>
            </div>

            {/* عنوان اصلی با فاصله خطوط باز */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.5] tracking-tight mb-3 text-[#221c12]">
              ابزار حرفه‌ای،
              <span className="block mt-1 bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">
                کیفیت بی‌نظیر
              </span>
            </h1>

            {/* توضیح کوتاه */}
            <p className="text-[#8c8272] text-sm sm:text-base md:text-lg mb-5 sm:mb-7 max-w-xl leading-relaxed font-normal">
              از برندهای معتبر جهانی Bosch، DeWalt و Makita — مستقیم به دست شما
            </p>

            {/* نمایش تصویر ابزار در سایز موبایل (بین متن و دکمه‌ها) */}
            <div className="block sm:hidden my-4 relative mx-auto w-full max-w-[240px] text-center">
              <div className="relative inline-block">
                <img
                  src={heroImageUrl ? (getMediaUrl(heroImageUrl) || heroImageUrl) : '/hero_tools.jpg'}
                  alt="ابزارآلات صنعتی گرگیچ"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/hero_tools.jpg';
                  }}
                  className={`w-full max-h-[220px] object-contain drop-shadow-[0_15px_25px_rgba(90,70,20,0.2)] -rotate-2 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-4 bg-[radial-gradient(ellipse,rgba(90,70,20,0.2),transparent_70%)] blur-[4px] pointer-events-none" />
              </div>
            </div>

            {/* دکمه‌های فراخوان (CTA) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-2 sm:mt-0">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm md:text-base shadow-[0_4px_18px_rgba(199,154,75,0.35)] hover:shadow-[0_6px_26px_rgba(199,154,75,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>مشاهده محصولات</span>
                <ArrowLeft size={18} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-[#c79a4b]/60 text-[#a67d34] bg-white/90 hover:bg-[#fbf7f0] hover:border-[#c79a4b] font-bold text-sm md:text-base transition-all duration-300"
              >
                <span>دسته‌بندی ابزارها</span>
              </Link>
            </div>

            {/* آمار فروشگاه در پایین کارت */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-7 pt-6 border-t border-[#ece4d3] text-center">
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#a67d34]">+500</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#8c8272] mt-0.5 font-medium">محصول متنوع</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#a67d34]">+8</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#8c8272] mt-0.5 font-medium">برند معتبر</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#a67d34]">+10,000</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#8c8272] mt-0.5 font-medium">مشتری راضی</p>
              </div>
            </div>
          </div>

          {/* نمایش تصویر ابزار در سایز تبلت و دسکتاپ (ستون سمت چپ) */}
          <div className="hidden sm:flex flex-[0.9] relative items-center justify-center sm:min-h-[300px] w-full lg:w-auto">
            <div className="relative group">
              <img
                src={heroImageUrl ? (getMediaUrl(heroImageUrl) || heroImageUrl) : '/hero_tools.jpg'}
                alt="ابزارآلات صنعتی گرگیچ"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/hero_tools.jpg';
                }}
                className={`max-w-[280px] md:max-w-[340px] lg:max-w-[380px] w-full object-contain filter drop-shadow-[0_25px_35px_rgba(90,70,20,0.25)] -rotate-3 transition-all duration-500 group-hover:rotate-[-1deg] group-hover:scale-[1.02] ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-[radial-gradient(ellipse,rgba(90,70,20,0.22),transparent_70%)] blur-[5px] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
