import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const VALUE_PROPS = [
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل ۲۴ تا ۴۸ ساعته در سراسر کشور' },
  { icon: ShieldCheck, title: 'محصولات اصل', desc: 'گارانتی اصالت و سلامت فیزیکی کالا' },
  { icon: Headphones, title: 'پشتیبانی تخصصی', desc: 'مشاوره فنی توسط کارشناسان ابزار' },
  { icon: RefreshCw, title: 'بازگشت آسان', desc: 'تا ۷ روز امکان مرجوعی کالا' },
];

export function ValueProps() {
  return (
    <section className="bg-gradient-to-r from-gold-light/20 via-gold-light/40 to-gold-light/20 py-14 border-y border-gold/20">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group p-5 rounded-card bg-surface/80 border border-border/50 hover:border-gold hover:shadow-card transition-all duration-300 flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-surface border border-gold/30 flex items-center justify-center shadow-card group-hover:border-gold group-hover:shadow-gold-glow group-hover:scale-105 transition-all duration-300">
              <Icon size={24} className="text-gold-dark group-hover:text-gold transition-colors" />
            </div>
            <h3 className="font-semibold text-base text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

