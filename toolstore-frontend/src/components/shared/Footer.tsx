import { Link } from 'react-router-dom';
import {
  ShieldCheck, RotateCcw, Truck, MapPin, Phone, Mail,
  Send, Wrench, Zap,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#14110c] to-[#0a0806] text-[#d8cdb4] overflow-hidden select-none pt-28 sm:pt-32 md:pt-36 pb-6 px-4 sm:px-6 md:px-12">
      {/* بافت شبکه‌ای خطوط مهندسی/بلوپرینت محو (Grid Lines) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,184,105,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,184,105,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* آیکون‌های خطی تزئینی ابزار با شفافیت ۶٪ در پس‌زمینه */}
      <div className="absolute top-[10%] right-[4%] w-28 h-28 opacity-[0.06] text-[#d9b869] rotate-[20deg] pointer-events-none z-0 hidden lg:block">
        <Wrench size={110} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[12%] left-[4%] w-28 h-28 opacity-[0.06] text-[#d9b869] -rotate-[15deg] pointer-events-none z-0 hidden lg:block">
        <Zap size={110} strokeWidth={1} />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* ردیف اعتمادسازی و روش‌های پرداخت */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-9 mb-9 border-b border-[rgba(217,184,105,0.14)]">
          {/* بج‌های نماد اعتماد */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(217,184,105,0.07)] border border-[rgba(217,184,105,0.2)] text-xs font-semibold text-[#e8dcc0]">
              <ShieldCheck size={18} className="text-[#d9b869]" />
              <span>ضمانت اصالت کالا</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(217,184,105,0.07)] border border-[rgba(217,184,105,0.2)] text-xs font-semibold text-[#e8dcc0]">
              <RotateCcw size={18} className="text-[#d9b869]" />
              <span>7 روز ضمانت بازگشت</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(217,184,105,0.07)] border border-[rgba(217,184,105,0.2)] text-xs font-semibold text-[#e8dcc0]">
              <Truck size={18} className="text-[#d9b869]" />
              <span>ارسال سریع سراسری</span>
            </div>
          </div>

          {/* آیکون‌های چیپ روش‌های پرداخت */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-[#8c8272] ml-1">روش‌های پرداخت:</span>
            <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-[#b8ac95]">
              شتاب
            </div>
            <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-[#b8ac95]">
              ملی
            </div>
            <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-[#b8ac95]">
              سامان
            </div>
            <div className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-[#b8ac95]">
              پاسارگاد
            </div>
          </div>
        </div>

        {/* ۴ ستون فوتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10">
          {/* ستون ۱: برند و معرفی */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d9b869] to-[#a67d34] flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(217,184,105,0.5)]">
                <Wrench size={20} className="text-[#241a06]" />
              </div>
              <div className="font-display font-extrabold text-lg text-white">
                ابزارآلات <span className="bg-gradient-to-r from-[#d9b869] to-[#c79a4b] bg-clip-text text-transparent">گرگیج</span>
              </div>
            </div>

            <p className="text-xs text-[#a89f8c] leading-relaxed max-w-xs font-normal">
              فروشگاه تخصصی ابزار و یراق‌آلات حرفه‌ای با ضمانت اصالت کالا و بیش از 10 سال تجربه در تامین ابزار برندهای معتبر جهانی.
            </p>

            {/* شبکه‌های اجتماعی */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[rgba(217,184,105,0.08)] border border-[rgba(217,184,105,0.22)] flex items-center justify-center text-[#d9b869] hover:bg-[rgba(217,184,105,0.2)] hover:-translate-y-1 transition-all duration-200"
                aria-label="تلگرام"
              >
                <Send size={16} />
              </a>
              <a
                href="https://instagram.com/tools.gorgij"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[rgba(217,184,105,0.08)] border border-[rgba(217,184,105,0.22)] flex items-center justify-center text-[#d9b869] hover:bg-[rgba(217,184,105,0.2)] hover:-translate-y-1 transition-all duration-200"
                aria-label="اینستاگرام"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* ستون ۲: ارتباط با ما */}
          <div>
            <h4 className="font-bold text-sm text-[#f0e6cc] mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-7 after:h-0.5 after:bg-gradient-to-r after:from-[#d9b869] after:to-transparent after:rounded-full">
              ارتباط با ما
            </h4>
            <div className="space-y-3 text-xs text-[#a89f8c] leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#d9b869] shrink-0 mt-0.5" />
                <span>چابهار ، منطقه آزاد ، مجتمع فردوس ، غرفه 172 و 173</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#d9b869] shrink-0" />
                <span>09961197861</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#d9b869] shrink-0" />
                <span>info@gorgijtools.ir</span>
              </div>
            </div>
          </div>

          {/* ستون ۳: خدمات مشتریان */}
          <div>
            <h4 className="font-bold text-sm text-[#f0e6cc] mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-7 after:h-0.5 after:bg-gradient-to-r after:from-[#d9b869] after:to-transparent after:rounded-full">
              خدمات مشتریان
            </h4>
            <ul className="space-y-2.5 text-xs text-[#a89f8c]">
              <li>
                <Link to="/contact" className="hover:text-[#d9b869] transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d9b869] transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link to="/guarantee" className="hover:text-[#d9b869] transition-colors">
                  گارانتی محصولات
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#d9b869] transition-colors">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون ۴: راهنمای خرید */}
          <div>
            <h4 className="font-bold text-sm text-[#f0e6cc] mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-7 after:h-0.5 after:bg-gradient-to-r after:from-[#d9b869] after:to-transparent after:rounded-full">
              راهنمای خرید
            </h4>
            <ul className="space-y-2.5 text-xs text-[#a89f8c]">
              <li>
                <Link to="/faq" className="hover:text-[#d9b869] transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[#d9b869] transition-colors">
                  نحوه ارسال کالا
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#d9b869] transition-colors">
                  رویه بازگرداندن کالا
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#d9b869] transition-colors">
                  شرایط و قوانین
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* نوار پایانی کپی‌رایت */}
        <div className="border-t border-[rgba(217,184,105,0.14)] pt-5 text-center text-[11.5px] text-[#7a7060]">
          تمامی حقوق برای فروشگاه <b className="text-[#a89f8c] font-bold">ابزارآلات گرگیج</b> محفوظ است. © 2026
        </div>
      </div>
    </footer>
  );
}
