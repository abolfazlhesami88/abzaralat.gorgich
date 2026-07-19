import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="section-heading font-display text-h2 text-text-primary mb-8">
        دستهبندی محصولات
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-card animate-pulse" />
            ))
          : categories?.map((cat) => {
              const IconComponent = (Icons as any)[cat.iconName ?? 'Box'] ?? Icons.Box;
              return (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center justify-center gap-3 p-6 bg-surface border border-border rounded-card hover:border-gold hover:shadow-card transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-gold-light flex items-center justify-center group-hover:bg-gold transition-colors">
                    <IconComponent size={26} className="text-gold-dark group-hover:text-text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-text-primary text-center">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
      </div>
    </section>
  );
}
