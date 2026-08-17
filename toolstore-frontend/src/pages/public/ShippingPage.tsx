import { Truck, Package, Clock, AlertCircle } from 'lucide-react';

export function ShippingPage() {
  return (
    <div className="bg-[#fdfcfa] py-10 sm:py-16 min-h-screen text-[#221c12]">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 space-y-12">
        {/* هدر */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs font-bold mb-3 shadow-sm">
            <Truck size={14} />
            <span>ارسال مطمئن و سریع به سراسر ایران</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#221c12] tracking-tight mb-3">
            نحوه <span className="bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">ارسال کالا</span>
          </h1>
          <p className="text-sm sm:text-base text-[#7a7060] leading-relaxed">
            راهنمای کامل شیوه‌های ارسال، بسته‌بندی ایمن ابزارآلات و مدت زمان تحویل مرسولات به مشتریان
          </p>
        </div>

        {/* ۴ مرحله از ثبت تا تحویل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#ece4d3] shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center mx-auto font-black text-sm">
              ۱
            </div>
            <h3 className="font-bold text-sm text-[#221c12]">ثبت و بررسی سفارش</h3>
            <p className="text-xs text-[#7a7060] leading-relaxed">
              تأیید سفارش و بررسی سلامت فنی اولیه کالا در انبار
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ece4d3] shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center mx-auto font-black text-sm">
              ۲
            </div>
            <h3 className="font-bold text-sm text-[#221c12]">بسته‌بندی تخصصی</h3>
            <p className="text-xs text-[#7a7060] leading-relaxed">
              محافظت با نایلون حباب‌دار و کارتن چندلایه مقاوم
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ece4d3] shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center mx-auto font-black text-sm">
              ۳
            </div>
            <h3 className="font-bold text-sm text-[#221c12]">تحویل به شرکت حمل</h3>
            <p className="text-xs text-[#7a7060] leading-relaxed">
              تحویل سریع به پست پیشتاز یا تیپاکس و پیامک کد رهگیری
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#ece4d3] shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center mx-auto font-black text-sm">
              ۴
            </div>
            <h3 className="font-bold text-sm text-[#221c12]">تحویل درب آدرس</h3>
            <p className="text-xs text-[#7a7060] leading-relaxed">
              تحویل کالا توسط مامور ارسال به آدرس درج‌شده خریدار
            </p>
          </div>
        </div>

        {/* روش‌های ارسال */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.04)] space-y-6">
          <h2 className="text-xl font-bold text-[#221c12] flex items-center gap-2">
            <Package className="text-[#a67d34]" size={22} />
            روش‌های ارسال سفارشات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#ece4d3] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#221c12]">۱. پست پیشتاز سراسری</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#fbf1d9] text-[#a67d34] font-bold">پیش‌فرض</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5a5245] leading-relaxed">
                مناسب برای تمامی ابزارهای سبک، متوسط و بسته‌های استاندارد به تمام نقاط ایران حتی دورافتاده‌ترین مناطق روستایی و شهری.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#7a7060]">
                <Clock size={14} className="text-[#a67d34]" />
                <span>مدت زمان تحویل: ۲ تا ۴ روز کاری</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#ece4d3] space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#221c12]">۲. تیپاکس (سریع‌السیر)</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#ece4d3] text-[#5a5245] font-bold">اکسپرس</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5a5245] leading-relaxed">
                مناسب برای شهرهایی که دارای نمایندگی تیپاکس هستند با امکان رهگیری لحظه‌ای و تحویل بسیار سریع درب محل کار یا منزل.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#7a7060]">
                <Clock size={14} className="text-[#a67d34]" />
                <span>مدت زمان تحویل: ۱ تا ۲ روز کاری</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#ece4d3] space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#221c12]">۳. باربری و اتوبوس‌رانی (ابزارهای سنگین و کارگاهی)</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#ece4d3] text-[#5a5245] font-bold">بارهای حجیم</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5a5245] leading-relaxed">
                برای اقلام فوق‌سنگین صنعتی، کمپرسورها، بتن‌کن‌های بزرگ و خریدهای تعداد بالا، هماهنگی ارسال از طریق باربری‌های معتبر یا تعاونی‌های اتوبوس‌رانی انجام می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* نکات مهم هنگام دریافت کالا */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#fbf1d9]/50 border border-[#ecd9a8] space-y-4">
          <div className="flex items-center gap-2 text-[#a67d34] font-bold text-base">
            <AlertCircle size={20} />
            <h3>نکات مهم هنگام تحویل گرفتن بسته</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[#5a5245] leading-relaxed list-disc list-inside">
            <li>هنگام تحویل از مامور پست یا تیپاکس، از سلامت ظاهری کارتن و بسته اطمینان حاصل فرمایید.</li>
            <li>در صورت آسیب‌دیدگی شدید جعبه، از تحویل گرفتن آن خودداری کرده یا همان لحظه با پشتیبانی تماس بگیرید.</li>
            <li>کد رهگیری مرسوله حداکثر ظرف ۲۴ ساعت پس از ثبت سفارش از طریق سامانه پیامکی ارسال می‌گردد.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
