import { useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('عضویت شما در خبرنامه ابزارآلات گرگیچ با موفقیت ثبت شد');
      setEmail('');
    }
  };

  return (
    <section className="relative z-20 -mb-16 sm:-mb-20 md:-mb-24 px-4 select-none">
      <div className="max-w-[1000px] mx-auto bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#fdf9ee] border border-[#ecdcb0] rounded-[26px] p-6 sm:p-10 md:p-12 text-center shadow-[0_30px_60px_-20px_rgba(90,70,20,0.28)] relative overflow-hidden">
        {/* هاله طلایی دکوراتیو */}
        <div className="absolute -top-20 right-1/2 translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle,rgba(217,184,105,0.18)_0%,transparent_70%)] pointer-events-none" />

        {/* نشان گرد پاکت‌نامه با گرادیان طلایی */}
        <div className="w-14 h-14 mx-auto mb-4.5 rounded-2xl bg-gradient-to-br from-[#d9b869] to-[#a67d34] flex items-center justify-center text-[#2b1f08] shadow-[0_10px_20px_-6px_rgba(199,154,75,0.5)] relative z-10">
          <Mail size={26} strokeWidth={2} />
        </div>

        {/* عنوان و توضیح با نام برند ابزارآلات گرگیچ */}
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-[#221c12] font-extrabold mb-2.5 relative z-10 leading-tight">
          از تخفیف‌های ویژه و پیشنهادهای شگفت‌انگیز باخبر شوید
        </h2>
        <p className="text-[#8c8272] text-xs sm:text-sm md:text-base max-w-xl mx-auto mb-7 leading-relaxed font-normal relative z-10">
          با عضویت در خبرنامه‌ی ابزارآلات گرگیچ، تازه‌ترین محصولات و کوپن‌های تخفیف اختصاصی را مستقیماً دریافت کنید
        </p>

        {/* فرم عضویت در خبرنامه */}
        <form className="flex flex-col sm:flex-row max-w-[460px] mx-auto gap-2.5 relative z-10" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="نشانی ایمیل شما..."
            className="flex-1 h-12 px-4 rounded-[12px] border border-[#ece2c9] bg-gradient-to-b from-[#f9f5eb] to-white shadow-[inset_0_2px_5px_rgba(90,70,20,0.06)] text-[#221c12] text-sm text-right placeholder:text-[#8c8272]/60 focus:outline-none focus:border-[#c79a4b] transition-all"
            required
          />
          <button
            type="submit"
            className="btn-add-to-cart h-12 px-6 rounded-[12px] whitespace-nowrap text-sm font-bold text-[#2b1f08] shrink-0"
          >
            عضویت در خبرنامه
          </button>
        </form>
      </div>
    </section>
  );
}
