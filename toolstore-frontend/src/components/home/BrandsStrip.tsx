import { Link } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';
import { getMediaUrl } from '../../utils/media';

export function BrandsStrip() {
  const { data: brands, isLoading } = useBrands();

  return (
    <section className="bg-background py-12 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-3.5 py-1 rounded-pill bg-gold-light/60 border border-gold/30 text-gold-dark text-xs font-semibold">
            برندهای معتبر و همکار
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-32 h-16 bg-surface rounded-card animate-pulse border border-border/40" />
              ))
            : brands?.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/products?brandSlug=${brand.slug}`}
                  className="group px-6 py-4 rounded-card bg-surface border border-border/60 hover:border-gold/60 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center min-w-[130px] h-16"
                >
                  {brand.logoUrl ? (
                    <img 
                      src={getMediaUrl(brand.logoUrl)} 
                      alt={brand.name} 
                      className="h-9 max-w-[100px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                    />
                  ) : (
                    <span className="font-bold text-base uppercase text-text-secondary group-hover:text-gold-dark transition-colors">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

