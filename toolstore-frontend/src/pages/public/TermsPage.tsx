import { FileText, ShieldAlert, CheckCircle, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="bg-[#fdfcfa] py-10 sm:py-16 min-h-screen text-[#221c12]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 space-y-10">
        {/* هدر */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs font-bold mb-3 shadow-sm">
            <Scale size={14} />
            <span>قوانین و مقررات خرید از فروشگاه</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#221c12] tracking-tight mb-3">
            شرایط و <span className="bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">قوانین استفاده</span>
          </h1>
          <p className="text-sm text-[#7a7060] leading-relaxed">
            استفاده از خدمات و ثبت سفارش در ابزارآلات گرگیچ به منزله پذیرش کلیه شرایط و قوانین مندرج در این صفحه می‌باشد.
          </p>
        </div>

        {/* متن شرایط و قوانین */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.04)] space-y-8 text-xs sm:text-sm text-[#5a5245] leading-relaxed">
          {/* بخش ۱ */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#221c12] flex items-center gap-2 border-b border-[#f5efe3] pb-2">
              <FileText className="text-[#a67d34]" size={18} />
              ۱. تعاریف و شرایط عمومی
            </h2>
            <p>
              ورود کاربران به وب‌سایت فروشگاه ابزارآلات گرگیچ و ثبت سفارش در هر زمان به معنی آگاهی کامل از شرایط و نحوه استفاده از خدمات، قیمت‌گذاری و رویه‌های ارسال فروشگاه است. کلیه اصول و رویه‌های فروشگاه منطبق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و مقررات منطقه آزاد تجاری-صنعتی چابهار است.
            </p>
          </div>

          {/* بخش ۲ */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#221c12] flex items-center gap-2 border-b border-[#f5efe3] pb-2">
              <CheckCircle className="text-[#a67d34]" size={18} />
              ۲. ثبت، پردازش و ارسال سفارش
            </h2>
            <p>
              کاربران موظفند در هنگام ثبت سفارش، اطلاعات پستی، کد پستی و شماره تماس خود را به صورت دقیق و کامل وارد نمایند. در صورت بروز هرگونه مغایرت یا اشتباه در آدرس، مسئولیت تاخیر در تحویل متوجه خریدار خواهد بود.
            </p>
            <p>
              روزهای کاری فروشگاه از شنبه تا پنجشنبه به استثنای تعطیلات رسمی است و کلیه سفارش‌های ثبت‌شده در اولین روز کاری پردازش و وارد مرحله بسته‌بندی و ارسال می‌شوند.
            </p>
          </div>

          {/* بخش ۳ */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#221c12] flex items-center gap-2 border-b border-[#f5efe3] pb-2">
              <ShieldAlert className="text-[#a67d34]" size={18} />
              ۳. قیمت‌گذاری و موجودی کالا
            </h2>
            <p>
              فروشگاه ابزارآلات گرگیچ همواره در تلاش است تا دقیق‌ترین قیمت‌ها و وضعیت موجودی انبار را در وب‌سایت منعکس نماید. قیمت‌های درج‌شده نهایی بوده و در صورت تغییرات ناگهانی نرخ ارز یا اتمام موجودی فیزیکی، فروشگاه حق لغو سفارش و استرداد وجه ظرف ۲۴ ساعت به حساب خریدار را برای خود محفوظ می‌دارد.
            </p>
          </div>

          {/* بخش ۴ */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#221c12] flex items-center gap-2 border-b border-[#f5efe3] pb-2">
              <CheckCircle className="text-[#a67d34]" size={18} />
              ۴. ضمانت اصالت و سلامت فیزیکی
            </h2>
            <p>
              تمامی ابزارهای ارائه‌شده در فروشگاه گرگیچ با تضمین اصالت برند و سلامت کامل فیزیکی ارسال می‌شوند. مشتری موظف است در لحظه تحویل از مامور پست یا تیپاکس، وضعیت ظاهری بسته را رویت کند.
            </p>
          </div>

          {/* بخش ۵ */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#221c12] flex items-center gap-2 border-b border-[#f5efe3] pb-2">
              <FileText className="text-[#a67d34]" size={18} />
              ۵. حریم خصوصی و امنیت اطلاعات
            </h2>
            <p>
              اطلاعات هویتی و تماس کاربران نزد فروشگاه ابزارآلات گرگیچ محفوظ بوده و صرفاً جهت پردازش سفارش، ارسال پیامک کد رهگیری و هماهنگی‌های مربوط به خرید مورد استفاده قرار می‌گیرد و به هیچ شخص ثالثی ارائه نخواهد شد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
