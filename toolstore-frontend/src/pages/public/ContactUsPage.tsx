import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ContactUsPage() {
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error('لطفاً فیلدهای الزامی را تکمیل کنید.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      toast.success('پیام شما با موفقیت ارسال شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.');
      setForm({ name: '', phone: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="bg-[#fdfcfa] py-10 sm:py-14 min-h-screen text-[#221c12]">
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        {/* هدر صفحه */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbf1d9] border border-[#ecd9a8] text-[#a67d34] text-xs font-bold mb-3 shadow-sm">
            <MessageSquare size={14} />
            <span>همیشه در کنار شما هستیم</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#221c12] tracking-tight mb-3">
            تماس با <span className="bg-gradient-to-r from-[#a67d34] via-[#c79a4b] to-[#d9b869] bg-clip-text text-transparent">ابزارآلات گرگیچ</span>
          </h1>
          <p className="text-sm sm:text-base text-[#7a7060] leading-relaxed font-normal">
            برای مشاوره خرید، استعلام موجودی عمده یا پیگیری سفارش، از طریق راه‌های ارتباطی زیر یا فرم پیام با ما در ارتباط باشید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ستون کارت‌های اطلاعات تماس */}
          <div className="lg:col-span-5 space-y-4">
            {/* کارت تلفن */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.04)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] border border-[#ecd9a8] flex items-center justify-center text-[#a67d34] shrink-0">
                <Phone size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-[#221c12] mb-1">تماس تلفنی و مشاوره</h3>
                <p className="text-xs text-[#7a7060] mb-2">پاسخگویی در ساعات کاری</p>
                <a
                  href="tel:09961197861"
                  className="font-bold text-lg text-[#a67d34] hover:text-[#c79a4b] transition-colors dir-ltr inline-block"
                >
                  09961197861
                </a>
              </div>
            </div>

            {/* کارت آدرس */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.04)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] border border-[#ecd9a8] flex items-center justify-center text-[#a67d34] shrink-0">
                <MapPin size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-[#221c12] mb-1">آدرس فروشگاه فیزیکی</h3>
                <p className="text-xs sm:text-sm text-[#5a5245] leading-relaxed">
                  چابهار ، منطقه آزاد تجاری صنعتی ، مجتمع تجاری فردوس ، طبقه همکف ، غرفه ۱۷۲ و ۱۷۳
                </p>
              </div>
            </div>

            {/* کارت ایمیل و ساعات کاری */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.04)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fbf1d9] border border-[#ecd9a8] flex items-center justify-center text-[#a67d34] shrink-0">
                <Clock size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-[#221c12] mb-1">ساعات کاری و پشتیبانی</h3>
                <p className="text-xs text-[#5a5245] leading-relaxed">
                  شنبه تا پنجشنبه: ۹:۰۰ صبح الی ۲۱:۰۰ شب
                </p>
                <p className="text-xs text-[#5a5245] leading-relaxed mt-0.5">
                  جمعه‌ها: ۱۶:۰۰ الی ۲۱:۰۰ شب
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-[#ece4d3] flex items-center gap-2 text-xs text-[#7a7060]">
                  <Mail size={14} className="text-[#a67d34]" />
                  <span>info@gorgijtools.ir</span>
                </div>
              </div>
            </div>
          </div>

          {/* ستون فرم ارسال پیام */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ece4d3] shadow-[0_8px_30px_rgba(34,28,18,0.05)]">
              <h2 className="text-xl font-bold text-[#221c12] mb-2">ارسال پیام مستقیم</h2>
              <p className="text-xs sm:text-sm text-[#7a7060] mb-6">
                فرم زیر را پر کنید؛ کارشناسان فروش ما در سریع‌ترین زمان ممکن با شما تماس می‌گیرند.
              </p>

              {isSent ? (
                <div className="p-6 rounded-2xl bg-[#fbf1d9]/50 border border-[#ecd9a8] text-center space-y-3">
                  <CheckCircle2 size={44} className="text-[#a67d34] mx-auto" />
                  <h4 className="font-bold text-base text-[#221c12]">پیام شما دریافت شد!</h4>
                  <p className="text-xs text-[#7a7060]">از ارتباط شما سپاسگزاریم. به زودی با شما تماس می‌گیریم.</p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#a67d34] text-white hover:bg-[#8e6827] transition-colors"
                  >
                    ارسال پیام دیگر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#5a5245] mb-1.5">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="مثلا: علی رضایی"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ece4d3] focus:border-[#c79a4b] focus:ring-1 focus:ring-[#c79a4b] outline-none text-sm bg-[#faf9f5]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#5a5245] mb-1.5">
                        شماره تماس *
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="09123456789"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ece4d3] focus:border-[#c79a4b] focus:ring-1 focus:ring-[#c79a4b] outline-none text-sm bg-[#faf9f5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5a5245] mb-1.5">
                      موضوع پیام
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="مثلا: استعلام قیمت ابزار نجاری یا پیگیری سفارش"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ece4d3] focus:border-[#c79a4b] focus:ring-1 focus:ring-[#c79a4b] outline-none text-sm bg-[#faf9f5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5a5245] mb-1.5">
                      متن پیام *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="متن پیام، پرسش یا سفارش خود را بنویسید..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ece4d3] focus:border-[#c79a4b] focus:ring-1 focus:ring-[#c79a4b] outline-none text-sm bg-[#faf9f5] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm shadow-[0_4px_18px_rgba(199,154,75,0.3)] hover:shadow-[0_6px_26px_rgba(199,154,75,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
