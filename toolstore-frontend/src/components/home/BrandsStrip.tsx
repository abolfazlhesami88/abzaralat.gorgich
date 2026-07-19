import { Link } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';

export function BrandsStrip() {
  const { data: brands, isLoading } = useBrands();

  return (
    <section className="bg-white py-12 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-24 h-12 bg-gray-100 animate-pulse rounded" />
              ))
            : brands?.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/products?brandSlug=${brand.slug}`}
                  className="group flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                >
                  {brand.logoUrl ? (
                    <img 
                      src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + brand.logoUrl} 
                      alt={brand.name} 
                      className="h-12 object-contain" 
                    />
                  ) : (
                    <span className="font-bold text-xl uppercase text-text-muted group-hover:text-gold-dark transition-colors">
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
