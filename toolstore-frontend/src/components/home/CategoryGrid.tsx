import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-[#fdfcfa] py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* عنوان بخش */}
        <div className="mb-10 text-right">
          <h2 className="section-heading font-display text-h2 text-[#221c12] mb-2 font-bold">
            دسته‌بندی محصولات
          </h2>
          <p className="text-[#8c8272] text-sm md:text-base pr-4 font-normal">
            دسته‌بندی جامع تجهیزات و ابزارهای تخصصی با بهترین کیفیت و گارانتی اصالت
          </p>
        </div>

        {/* کارت‌های دسته‌بندی */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-44 bg-[#f9f6f0] rounded-[20px] animate-pulse border border-[#ece4d3]" />
              ))
            : categories?.map((cat) => {
                const IconComponent = (Icons as any)[cat.iconName ?? 'Box'] ?? Icons.Box;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group flex flex-col items-center justify-center gap-4 p-6 bg-white border border-[#ece4d3] rounded-[20px] shadow-[0_4px_20px_rgba(34,28,18,0.03)] hover:shadow-[0_12px_32px_rgba(34,28,18,0.08)] hover:border-[#c79a4b]/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* دایره کرم-طلایی آیکون فوق‌العاده شیک */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fdfbf7] via-[#f9f4ea] to-[#f5edd6] border border-[#f0e6cc] flex items-center justify-center text-[#c79a4b] group-hover:scale-110 group-hover:border-[#c79a4b]/40 transition-all duration-300 shadow-sm">
                      <IconComponent size={28} className="text-[#c79a4b] group-hover:text-[#a67d34] transition-colors" />
                    </div>
                    <span className="text-base font-bold text-[#221c12] text-center group-hover:text-[#c79a4b] transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
