import { useState } from 'react';
import { HelpCircle, ChevronDown, Search, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'ثبت و پیگیری سفارش',
    q: 'چگونه می‌توانم در ابزارآلات گرگیچ سفارش خود را ثبت کنم؟',
    a: 'کافیست محصول مورد نظر را انتخاب کرده و به سبد خرید اضافه کنید. سپس به صفحه تسویه حساب بروید، آدرس و مشخصات تحویل‌گیرنده را وارد نموده و پرداخت را از طریق درگاه امن بانکی انجام دهید.'
  },
  {
    category: 'ثبت و پیگیری سفارش',
    q: 'چطور می‌توانم وضعیت سفارش خود را پیگیری کنم؟',
    a: 'پس از ثبت سفارش، کد رهگیری سفارش برای شما پیامک می‌شود. همچنین با ورود به بخش «حساب کاربری > سفارش‌های من» می‌توانید وضعیت لحظه‌ای بسته‌بندی، ارسال و کد رهگیری پستی/تیپاکس را مشاهده کنید.'
  },
  {
    category: 'ثبت و پیگیری سفارش',
    q: 'آیا امکان لغو یا تغییر در سفارش وجود دارد؟',
    a: 'تا قبل از تغییر وضعیت سفارش به «در حال ارسال / تحویل به پست»، می‌توانید با تماس مستقیم با شماره پشتیبانی 09961197861 درخواست تغییر یا لغو سفارش خود را ثبت نمایید.'
  },
  {
    category: 'ارسال و تحویل',
    q: 'سفارش‌ها با چه روش‌هایی و طی چند روز تحویل داده می‌شوند؟',
    a: 'سفارش‌ها بسته به وزن و نوع کالا با پست پیشتاز، تیپاکس و باربری (برای ابزارهای فوق سنگین صنعتی) ارسال می‌شوند. زمان تحویل در تهران و مراکز استان‌ها ۲ تا ۳ روز کاری و برای سایر شهرستان‌ها ۳ تا ۴ روز کاری است.'
  },
  {
    category: 'ارسال و تحویل',
    q: 'هزینه ارسال کالا چقدر است؟',
    a: 'هزینه ارسال در مرحله تسویه حساب بر اساس وزن و شیوه انتخابی (پست یا تیپاکس) به صورت شفاف محاسبه و به فاکتور افزوده می‌شود.'
  },
  {
    category: 'اصالت و گارانتی',
    q: 'آیا کالاهای فروشگاه اصل (اورجینال) هستند؟',
    a: 'بله، تمامی کالاهای موجود در فروشگاه ابزارآلات گرگیچ ۱۰۰٪ اورجینال و با ضمانت اصالت فیزیکی و برند عرضه می‌شوند. فروشگاه گرگیچ هیچ‌گونه کالای طرح یا فیک عرضه نمی‌کند.'
  },
  {
    category: 'اصالت و گارانتی',
    q: 'اگر کالا هنگام تحویل دچار آسیب‌دیدگی فیزیکی بود چه کار کنم؟',
    a: 'تمام مرسولات با بسته‌بندی ضربه‌گیر استاندارد ارسال می‌شوند. در صورت مشاهده هرگونه آسیب‌دیدگی ظاهری کارتن در زمان تحویل، موضوع را ظرف ۲۴ ساعت به شماره پشتیبانی اطلاع دهید تا سریعاً پیگیری شود.'
  },
  {
    category: 'پرداخت و فاکتور',
    q: 'چه روش‌هایی برای پرداخت سفارش وجود دارد؟',
    a: 'پرداخت به صورت آنلاین از طریق درگاه‌های پرداخت متصل به شبکه شتاب با تمامی کارت‌های بانکی عضو شتاب امکان‌پذیر است. برای خریدهای عمده شرکتی نیز امکان واریز به حساب وجود دارد.'
  },
  {
    category: 'پرداخت و فاکتور',
    q: 'آیا فاکتور خرید همراه کالا ارسال می‌شود؟',
    a: 'بله، فاکتور رسمی فروشگاه شامل مشخصات کالا، قیمت و مشخصات خریدار درون بسته قرار داده شده و نسخه دیجیتال آن در پنل کاربری نیز در دسترس است.'
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('همه');

  const categories = ['همه', 'ثبت و پیگیری سفارش', 'ارسال و تحویل', 'اصالت و گارانتی', 'پرداخت و فاکتور'];

  const filteredFaqs = FAQS.filter(item => {
    const matchCat = activeCategory === 'همه' || item.category === activeCategory;
    const matchSearch = item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#fdfcfa] py-10 sm:py-14 min-h-screen text-[#221c12]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 space-y-10">
        {/* هدر صفحه */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs font-bold mb-3 shadow-sm">
            <HelpCircle size={14} />
            <span>راهنمای پاسخ به پرسش‌ها</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#221c12] tracking-tight mb-3">
            سوالات <span className="bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">متداول کاربران</span>
          </h1>
          <p className="text-sm text-[#7a7060] leading-relaxed">
            پاسخ سریع به متداول‌ترین پرسش‌های خریداران درباره نحوه خرید، اصالت ابزارها و ارسال مرسولات
          </p>

          {/* نوار جستجو در سوالات */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89f8c]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در سوالات متداول..."
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[#ece4d3] focus:border-[#c79a4b] focus:ring-1 focus:ring-[#c79a4b] outline-none text-sm bg-white shadow-sm"
            />
          </div>
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#a67d34] text-white shadow-sm'
                  : 'bg-white text-[#5a5245] border border-[#ece4d3] hover:border-[#a67d34]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* لیست آکاردئونی سوالات */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#ece4d3] text-sm text-[#7a7060]">
              سوالی مطابق با جستجوی شما یافت نشد.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#ece4d3] overflow-hidden shadow-[0_2px_12px_rgba(34,28,18,0.03)] transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right hover:bg-[#faf9f5] transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#221c12]">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-lg bg-[#fbf1d9] text-[#a67d34] flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5a5245] leading-relaxed border-t border-[#f5efe3]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* باکس تماس در صورت نیافتن پاسخ */}
        <div className="p-6 rounded-2xl bg-[#fbf1d9]/60 border border-[#ecd9a8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#a67d34] text-white flex items-center justify-center shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#221c12]">پاسخ سوال خود را نیافتید؟</h4>
              <p className="text-xs text-[#7a7060]">کارشناسان ما آماده پاسخگویی به هرگونه سوال و ابهام شما هستند.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-[#a67d34] text-white hover:bg-[#8e6827] text-xs font-bold transition-colors shadow-sm shrink-0"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      </div>
    </div>
  );
}
