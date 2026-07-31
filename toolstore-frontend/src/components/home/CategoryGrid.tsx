import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-background py-16 md:py-20 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-right">
          <h2 className="section-heading font-display text-h2 text-text-primary mb-2">
            دسته‌بندی محصولات
          </h2>
          <p className="text-text-secondary text-sm md:text-base pr-4">
            دسته‌بندی جامع تجهیزات و ابزارهای تخصصی با بهترین کیفیت و گارانتی اصالت
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-40 bg-surface/80 rounded-card animate-pulse border border-border/40" />
              ))
            : categories?.map((cat) => {
                const IconComponent = (Icons as any)[cat.iconName ?? 'Box'] ?? Icons.Box;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group flex flex-col items-center justify-center gap-4 p-6 bg-surface border border-border/80 rounded-card hover:border-gold hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-full bg-gold-light/50 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300 shadow-sm">
                      <IconComponent size={28} className="text-gold-dark group-hover:text-text-primary transition-colors" />
                    </div>
                    <span className="text-base font-semibold text-text-primary text-center group-hover:text-gold-dark transition-colors">
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

