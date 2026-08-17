import { ShieldCheck, Award, Truck, Users, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutUsPage() {
  return (
    <div className="bg-[#fdfcfa] py-10 sm:py-16 min-h-screen text-[#221c12]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* بخش هیرو درباره ما */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs font-bold mb-4 shadow-sm">
            <Sparkles size={14} />
            <span>بیش از ۱۰ سال تجربه تخصصی در منطقه آزاد چابهار</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#221c12] tracking-tight mb-5 leading-tight">
            درباره فروشگاه <span className="bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">ابزارآلات گرگیچ</span>
          </h1>
          <p className="text-base sm:text-lg text-[#7a7060] leading-relaxed font-normal">
            تامین‌کننده مستقیم و بدون واسطه برترین ابزارآلات برقی، شارژی، بادی، بنزینی و یراق‌آلات صنعتی از برندهای معتبر جهانی با تضمین اصالت ۱۰۰٪ کالا.
          </p>
        </div>

        {/* داستان ما */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#ece4d3] shadow-[0_8px_30px_rgba(34,28,18,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#a67d34]">
              <Target size={16} />
              <span>داستان و رسالت ما</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#221c12]">
              کیفیت جهانی، دسترسی آسان و قیمت واقعی منطقه آزاد
            </h2>
            <p className="text-sm text-[#5a5245] leading-relaxed">
              مجموعه <b>ابزارآلات گرگیچ</b> فعالیت خود را با هدف رفع دغدغه صنعتگران، کارگاه‌ها و علاقه‌مندان به ابزار در زمینه خرید ابزارآلات اورجینال و باکیفیت در منطقه آزاد تجاری چابهار آغاز نمود. به دلیل موقعیت استراتژیک منطقه آزاد چابهار و ارتباط مستقیم با مبادی ورودی کالا، توانسته‌ایم بهترین برندهای دنیا نظیر بوش (Bosch)، دیوالت (DeWalt)، ماکیتا (Makita)، رونیکس (Ronix) و توسن را با مناسب‌ترین قیمت ممکن به دست مصرف‌کنندگان و متخصصان سراسر کشور برسانیم.
            </p>
            <p className="text-sm text-[#5a5245] leading-relaxed">
              ما باور داریم ابزار باکیفیت، امنیت و دقت کار شما را تضمین می‌کند؛ بنابراین اصالت تمامی کالاهای ارائه‌شده در گرگیچ تضمین‌شده است.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#fbf1d9]/60 border border-[#ecd9a8] text-center">
              <p className="text-3xl font-extrabold text-[#a67d34] mb-1">+500</p>
              <p className="text-xs font-bold text-[#5a5245]">تنوع ابزار تخصصی</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#fbf1d9]/60 border border-[#ecd9a8] text-center">
              <p className="text-3xl font-extrabold text-[#a67d34] mb-1">+10,000</p>
              <p className="text-xs font-bold text-[#5a5245]">مشتری و خریدار راضی</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#fbf1d9]/60 border border-[#ecd9a8] text-center">
              <p className="text-3xl font-extrabold text-[#a67d34] mb-1">۱۰ سال</p>
              <p className="text-xs font-bold text-[#5a5245]">سابقه حضور در بازار</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#fbf1d9]/60 border border-[#ecd9a8] text-center">
              <p className="text-3xl font-extrabold text-[#a67d34] mb-1">۱۰۰٪</p>
              <p className="text-xs font-bold text-[#5a5245]">ضمانت اصالت و سلامت</p>
            </div>
          </div>
        </div>

        {/* ارزش‌های کلیدی ما */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#221c12] mb-2">چرا ابزارآلات گرگیچ؟</h3>
            <p className="text-xs sm:text-sm text-[#7a7060]">ارزش‌هایی که ما را در خدمت‌رسانی به شما متمایز می‌کند</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-bold text-base text-[#221c12]">تضمین اصالت کالا</h4>
              <p className="text-xs text-[#7a7060] leading-relaxed">
                ارائه مستقیم کالاهای اورجینال بدون کالای فیک یا تقلبی همراه با برچسب و بسته‌بندی اصلی.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center">
                <Award size={24} />
              </div>
              <h4 className="font-bold text-base text-[#221c12]">قیمت رقابتی و دست اول</h4>
              <p className="text-xs text-[#7a7060] leading-relaxed">
                حذف واسطه‌ها و عرضه کالا با قیمت واقعی به دلیل استقرار در مجتمع تجاری فردوس منطقه آزاد.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h4 className="font-bold text-base text-[#221c12]">ارسال سریع سراسری</h4>
              <p className="text-xs text-[#7a7060] leading-relaxed">
                بسته‌بندی ایمن و ارسال با پست پیشتاز، تیپاکس و باربری به تمام استان‌ها و شهرستان‌های کشور.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-base text-[#221c12]">مشاوره فنی رایگان</h4>
              <p className="text-xs text-[#7a7060] leading-relaxed">
                تیم پشتیبانی و کارشناسان فنی ما قبل از خرید به شما در انتخاب دقیق‌ترین ابزار کمک می‌کنند.
              </p>
            </div>
          </div>
        </div>

        {/* بنر فراخوان خرید */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1b1711] via-[#2a2216] to-[#1b1711] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#d9b869] mb-2">
              به دنبال ابزاری خاص یا خرید عمده هستید؟
            </h3>
            <p className="text-xs sm:text-sm text-[#b8ac95]">
              کاتالوگ بیش از ۵۰۰ قلم کالای موجود ما را بررسی کنید یا با مشاوران ما تماس بگیرید.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-[#221c12] font-extrabold text-sm transition-all shadow-md"
            >
              مشاهده محصولات
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 font-bold text-sm transition-all"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
