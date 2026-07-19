import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-text-primary text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-l from-text-primary via-text-primary/95 to-transparent z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=2000&auto=format&fit=crop')" }}
      />

      <div className="container mx-auto px-4 relative z-20 py-24 md:py-32">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 text-gold rounded-pill text-xs font-semibold mb-4">
            بیش از ۵۰۰ محصول اصل و گارانتیدار
          </span>
          <h1 className="font-display text-4xl md:text-hero font-bold leading-tight mb-4">
            ابزار حرفهای،
            <br />
            <span className="text-gold">کیفیت بینظیر</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-md">
            از برندهای معتبر جهانی Bosch، DeWalt و Makita — مستقیم به دست شما
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-text-primary font-bold px-7 py-3.5 rounded-button transition-colors"
            >
              مشاهده محصولات
              <ArrowLeft size={18} />
            </Link>
          </div>

          {/* آمار */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-gold">۵۰۰+</p>
              <p className="text-sm text-gray-400">محصول متنوع</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">۸+</p>
              <p className="text-sm text-gray-400">برند معتبر</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold">۱۰هزار+</p>
              <p className="text-sm text-gray-400">مشتری راضی</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
