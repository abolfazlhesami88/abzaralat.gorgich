import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Wrench, Hammer, Compass, Settings, Zap, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-[#0e0c09] text-[#f3ede0] py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden select-none">
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

      {/* نورهای شعاعی و گرادیان پس‌زمینه */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(217,184,105,0.09)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(217,184,105,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(217,184,105,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* الگو شبکه نوری طلایی محو */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#d9b869" strokeWidth="0.5" strokeOpacity="0.6" />
              <circle cx="48" cy="48" r="1.5" fill="#d9b869" fillOpacity="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* آیکون‌های شناور ابزارآلات در اطراف کارت */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 hidden md:block">
        {/* بالا چپ */}
        <div className="absolute top-[12%] left-[6%] text-[#d9b869] opacity-20 animate-float-1">
          <Wrench size={52} strokeWidth={1.2} />
        </div>
        {/* بالا راست */}
        <div className="absolute top-[15%] right-[7%] text-[#d9b869] opacity-20 animate-float-2">
          <Hammer size={48} strokeWidth={1.2} />
        </div>
        {/* پایین چپ */}
        <div className="absolute bottom-[16%] left-[8%] text-[#d9b869] opacity-15 animate-float-3">
          <Compass size={50} strokeWidth={1.2} />
        </div>
        {/* پایین راست */}
        <div className="absolute bottom-[18%] right-[6%] text-[#d9b869] opacity-20 animate-float-4">
          <Settings size={56} strokeWidth={1.2} />
        </div>
        {/* مرکز چپ */}
        <div className="absolute top-[48%] left-[2%] text-[#d9b869] opacity-15 animate-float-2">
          <Zap size={40} strokeWidth={1.2} />
        </div>
        {/* مرکز راست */}
        <div className="absolute top-[52%] right-[3%] text-[#d9b869] opacity-15 animate-float-1">
          <Shield size={42} strokeWidth={1.2} />
        </div>
      </div>

      {/* کارت شیشه‌ای اصلی معلق */}
      <div className="relative z-20 w-full max-w-[980px] mx-auto rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 lg:p-14 backdrop-blur-[20px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-[#d9b869]/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(217,184,105,0.06)] overflow-hidden">
        {/* لایه نور ظریف بالای کارت (Inset Highlight) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        <div className="max-w-2xl">
          {/* بج کیفیت و اصالت */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d9b869]/10 border border-[#d9b869]/25 text-[#e8cd8f] text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <ShieldCheck size={16} className="text-[#d9b869]" />
            <span>بیش از ۵۰۰ محصول اصل و گارانتی‌دار</span>
          </div>

          {/* عنوان اصلی */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold leading-[1.25] tracking-tight mb-5 text-[#f3ede0]">
            ابزار حرفه‌ای،
            <br />
            <span className="bg-gradient-to-r from-[#e8cd8f] via-[#d9b869] to-[#c4a659] bg-clip-text text-transparent">
              کیفیت بی‌نظیر
            </span>
          </h1>

          {/* توضیح زیر عنوان */}
          <p className="text-[#b8ac95] text-base md:text-lg mb-8 max-w-xl leading-relaxed">
            از برندهای معتبر جهانی Bosch، DeWalt و Makita — مستقیم به دست شما
          </p>

          {/* دکمه‌های فراخوان (CTA) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#d9b869] to-[#e8cd8f] text-[#0e0c09] font-bold text-sm md:text-base shadow-[0_4px_20px_rgba(217,184,105,0.25)] hover:shadow-[0_6px_28px_rgba(217,184,105,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>مشاهده محصولات</span>
              <ArrowLeft size={18} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f3ede0] border border-[#d9b869]/30 font-semibold text-sm md:text-base transition-all duration-300"
            >
              <span>دسته‌بندی ابزارها</span>
            </Link>
          </div>

          {/* آمار فروشگاه */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-7 border-t border-[#d9b869]/15">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#e8cd8f]">۵۰۰+</p>
              <p className="text-xs sm:text-sm text-[#b8ac95] mt-0.5">محصول متنوع</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#e8cd8f]">۸+</p>
              <p className="text-xs sm:text-sm text-[#b8ac95] mt-0.5">برند معتبر</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#e8cd8f]">۱۰هزار+</p>
              <p className="text-xs sm:text-sm text-[#b8ac95] mt-0.5">مشتری راضی</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
