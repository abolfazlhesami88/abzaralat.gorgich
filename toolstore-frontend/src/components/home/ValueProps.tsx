import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';

const VALUE_PROPS = [
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل ۲۴ تا ۴۸ ساعته در سراسر کشور' },
  { icon: ShieldCheck, title: 'محصولات اصل', desc: 'گارانتی اصالت و سلامت فیزیکی کالا' },
  { icon: Headphones, title: 'پشتیبانی تخصصی', desc: 'مشاوره فنی توسط کارشناسان ابزار' },
  { icon: RefreshCw, title: 'بازگشت آسان', desc: 'تا ۷ روز امکان مرجوعی کالا' },
];

export function ValueProps() {
  return (
    <section className="bg-[#fdfcfa] py-12">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-5">
        {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="group p-5 rounded-[20px] bg-white border border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.02)] hover:border-[#c79a4b]/60 hover:shadow-[0_10px_28px_rgba(34,28,18,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center text-[#c79a4b] group-hover:scale-105 group-hover:border-[#c79a4b]/40 transition-all duration-300 shadow-sm">
              <Icon size={24} className="text-[#c79a4b] group-hover:text-[#a67d34] transition-colors" />
            </div>
            <h3 className="font-bold text-base text-[#221c12]">{title}</h3>
            <p className="text-xs text-[#8c8272] leading-relaxed font-normal">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
