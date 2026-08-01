import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Truck, Headphones, Hammer, Compass, Settings, Zap, Shield } from 'lucide-react';

export function AuthBrandPanel() {
  return (
    <div className="relative w-full lg:w-[46%] xl:w-[42%] bg-gradient-to-br from-[#14110c] via-[#0f0d09] to-[#0a0806] text-[#f3ede0] p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden select-none shrink-0 border-b lg:border-b-0 lg:border-l border-[#d9b869]/20">
      {/* استایل انیمیشن‌های شناور ملایم */}
      <style>{`
        @keyframes float-auth-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(5deg); }
        }
        @keyframes float-auth-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(16px) rotate(-6deg); }
        }
        .animate-float-a1 { animation: float-auth-1 9s ease-in-out infinite; }
        .animate-float-a2 { animation: float-auth-2 11s ease-in-out infinite 1s; }
      `}</style>

      {/* هاله‌های شعاعی طلایی پس‌زمینه */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,184,105,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(199,154,75,0.09)_0%,transparent_70%)] pointer-events-none" />

      {/* بافت شبکه خطوط نقشه فنی/بلوپرینت مهندسی */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none">
          <defs>
            <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d9b869" strokeWidth="0.5" strokeOpacity="0.8" />
              <circle cx="40" cy="40" r="1" fill="#d9b869" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* آیکون‌های خطی ابزار شناور در پس‌زمینه (opacity ۱۴٪) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden sm:block">
        <div className="absolute top-[12%] right-[8%] text-[#d9b869] opacity-14 animate-float-a1">
          <Wrench size={48} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[28%] left-[6%] text-[#d9b869] opacity-14 animate-float-a2">
          <Hammer size={44} strokeWidth={1.2} />
        </div>
        <div className="absolute bottom-[35%] right-[10%] text-[#d9b869] opacity-14 animate-float-a1">
          <Compass size={46} strokeWidth={1.2} />
        </div>
        <div className="absolute bottom-[18%] left-[12%] text-[#d9b869] opacity-14 animate-float-a2">
          <Settings size={52} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[52%] right-[4%] text-[#d9b869] opacity-12 animate-float-a2">
          <Zap size={38} strokeWidth={1.2} />
        </div>
        <div className="absolute top-[65%] left-[5%] text-[#d9b869] opacity-12 animate-float-a1">
          <Shield size={40} strokeWidth={1.2} />
        </div>
      </div>

      {/* بخش بالای پنل: لوگو و نام برند */}
      <div className="relative z-10 mb-8 sm:mb-12">
        <Link to="/" className="inline-flex items-center gap-3 group">
          {/* نشان (مونوگرام) گرد سه‌بعدی */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#d9b869] via-[#c79a4b] to-[#a67d34] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(199,154,75,0.4),inset_0_1px_2px_rgba(255,255,255,0.6)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
            <Wrench size={22} className="stroke-[2.2]" />
          </div>

          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#ffffff] via-[#e8cd8f] to-[#d9b869] bg-clip-text text-transparent">
              ابزارآلات گرگیچ
            </span>
            <span className="text-[9px] font-extrabold text-[#d9b869] tracking-[0.25em] uppercase -mt-0.5 opacity-90">
              GORGICH TOOLS
            </span>
          </div>
        </Link>
      </div>

      {/* بخش وسط: محتوا و معرفی برند */}
      <div className="relative z-10 my-auto py-4">
        {/* بج اعتبار */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d9b869]/10 border border-[#d9b869]/25 text-[#e8cd8f] text-xs font-semibold mb-5 backdrop-blur-md">
          <ShieldCheck size={15} className="text-[#d9b869]" />
          <span>تجهیزات صنعتی و ابزارآلات تخصصی</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-snug mb-4 text-[#f3ede0]">
          به دنیای ابزارهای
          <br />
          <span className="bg-gradient-to-r from-[#e8cd8f] via-[#d9b869] to-[#c4a659] bg-clip-text text-transparent">
            حرفه‌ای و اصیل
          </span>{' '}
          خوش آمدید
        </h2>

        <p className="text-[#b8ac95] text-sm sm:text-base leading-relaxed max-w-md font-normal">
          بیش از ۱۰ هزار تکنسین و متخصص در سراسر کشور، ابزارآلات صنعتی و خانگی خود را از مجموعه گرگیچ تأمین می‌کنند.
        </p>
      </div>

      {/* بخش پایین: ۳ ویژگی کلیدی */}
      <div className="relative z-10 pt-6 mt-6 border-t border-[#d9b869]/15 hidden sm:flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#d9b869]/15 border border-[#d9b869]/30 flex items-center justify-center text-[#d9b869] shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#f3ede0]">ضمانت ۱۰۰٪ اصالت کالا</h4>
            <p className="text-[11px] text-[#b8ac95]">ضمانت اصالت و سلامت فیزیکی تمام تجهیزات</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#d9b869]/15 border border-[#d9b869]/30 flex items-center justify-center text-[#d9b869] shrink-0">
            <Truck size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#f3ede0]">ارسال سریع سراسری</h4>
            <p className="text-[11px] text-[#b8ac95]">تحویل سریع ۲۴ تا ۴۸ ساعته به تمام استان‌ها</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#d9b869]/15 border border-[#d9b869]/30 flex items-center justify-center text-[#d9b869] shrink-0">
            <Headphones size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#f3ede0]">پشتیبانی تخصصی ابزار</h4>
            <p className="text-[11px] text-[#b8ac95]">مشاوره فنی و تخصصی پیش از خرید</p>
          </div>
        </div>
      </div>
    </div>
  );
}
