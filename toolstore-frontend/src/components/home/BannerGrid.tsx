import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Award, Wrench, ShieldCheck } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: 'جشنواره ابزارآلات برقی',
    subtitle: 'تا ۳۰٪ تخفیف ویژه تجهیزات کارگاهی',
    icon: Zap,
    gradient: 'from-[#d9b869] via-[#c79a4b] to-[#a67d34]',
    link: '/products?categoryId=power-tools',
  },
  {
    id: 2,
    title: 'برندهای اصلی جهانی',
    subtitle: 'Bosch, DeWalt, Makita با گارانتی اصالت',
    icon: Award,
    gradient: 'from-[#7a9bb5] via-[#4d7294] to-[#33506b]',
    link: '/products',
  },
  {
    id: 3,
    title: 'تجهیزات تخصصی و دستی',
    subtitle: 'مجموعه کامل جعبه‌ابزار و آچارآلات',
    icon: Wrench,
    gradient: 'from-[#d68566] via-[#b86248] to-[#8c4230]',
    link: '/products',
  },
  {
    id: 4,
    title: 'ضمانت ۱۰۰٪ اصالت گرگیچ',
    subtitle: '۷ روز مهلت بازگشت + ارسال فوری سراسری',
    icon: ShieldCheck,
    gradient: 'from-[#7a6d57] via-[#5c5243] to-[#4a4136]',
    link: '/products',
  },
];

export function BannerGrid() {
  return (
    <div className="my-8 md:my-10 select-none">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {BANNERS.map((b) => {
          const Icon = b.icon;
          return (
            <Link
              key={b.id}
              to={b.link}
              className={`group relative h-[110px] rounded-[16px] p-4 text-white bg-gradient-to-br ${b.gradient} shadow-[0_6px_20px_rgba(34,28,18,0.06)] hover:shadow-[0_12px_28px_rgba(34,28,18,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden border border-white/20`}
            >
              {/* هاله دکوراتیو شعاعی */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)] pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs border border-white/20 shadow-sm">
                  <Icon size={16} />
                </span>
                <ArrowLeft size={16} className="text-white/80 group-hover:-translate-x-1 transition-transform" />
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="font-display font-extrabold text-sm sm:text-base text-white leading-tight">
                  {b.title}
                </h3>
                <p className="text-[11px] text-white/85 truncate font-normal mt-0.5">
                  {b.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
