import { Link } from 'react-router-dom';
import { useBrands } from '../../hooks/useBrands';
import { getMediaUrl } from '../../utils/media';

export function BrandsStrip() {
  const { data: brands, isLoading } = useBrands();

  return (
    <section className="bg-[#fdfcfa] py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f7f2e7] border border-[#d9b869]/30 text-[#a67d34] text-xs font-semibold shadow-sm">
            برندهای معتبر و همکار
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-32 h-16 bg-white rounded-[16px] animate-pulse border border-[#ece4d3]" />
              ))
            : brands?.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/products?brandSlug=${brand.slug}`}
                  className="group px-6 py-4 rounded-[16px] bg-white border border-[#ece4d3] shadow-[0_2px_10px_rgba(34,28,18,0.02)] hover:border-[#c79a4b]/60 hover:shadow-[0_8px_24px_rgba(34,28,18,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center min-w-[130px] h-16"
                >
                  {brand.logoUrl ? (
                    <img 
                      src={getMediaUrl(brand.logoUrl)} 
                      alt={brand.name} 
                      className="h-9 max-w-[100px] object-contain opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                    />
                  ) : (
                    <span className="font-bold text-base uppercase text-[#8c8272] group-hover:text-[#a67d34] transition-colors">
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
