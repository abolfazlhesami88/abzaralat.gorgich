import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const VALUE_PROPS = [
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل ۲۴ تا ۴۸ ساعته در سراسر کشور' },
  { icon: ShieldCheck, title: 'محصولات اصل', desc: 'گارانتی اصالت و سلامت فیزیکی کالا' },
  { icon: Headphones, title: 'پشتیبانی تخصصی', desc: 'مشاوره فنی توسط کارشناسان ابزار' },
  { icon: RefreshCw, title: 'بازگشت آسان', desc: 'تا ۷ روز امکان مرجوعی کالا' },
];

export function ValueProps() {
  return (
    <section className="bg-gold-light/40 py-12">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-card">
              <Icon size={22} className="text-gold-dark" />
            </div>
            <h3 className="font-semibold text-sm text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
