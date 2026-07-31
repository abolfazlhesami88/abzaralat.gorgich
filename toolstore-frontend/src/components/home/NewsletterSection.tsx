import { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="bg-gradient-to-br from-text-primary via-text-primary/95 to-text-primary text-white py-16 relative overflow-hidden shadow-inner border-t border-gold/30">
      {/* Gold ambient background glow */}
      <div className="absolute -top-24 right-1/2 translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-gold/40 flex items-center justify-center mx-auto mb-4 text-gold shadow-gold-glow">
          <Mail size={30} />
        </div>

        <h2 className="font-display text-h2 md:text-3xl text-white font-bold mb-3">
          از تخفیف‌های ویژه و پیشنهادهای شگفت‌انگیز باخبر شوید
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          با عضویت در خبرنامه ToolStore Pro، تازه‌ترین محصولات و کوپن‌های تخفیف اختصاصی را مستقیماً دریافت کنید.
        </p>

        <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="نشانی ایمیل شما (مثلاً example@mail.com)"
            className="flex-1 h-12 px-4 rounded-button bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="h-12 bg-gold hover:bg-gold-hover text-text-primary font-bold px-7 rounded-button shadow-card hover:shadow-gold-glow transition-all duration-300 shrink-0"
          >
            عضویت در خبرنامه
          </button>
        </form>
      </div>
    </section>
  );
}

