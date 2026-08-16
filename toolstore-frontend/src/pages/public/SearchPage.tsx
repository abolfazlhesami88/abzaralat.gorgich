import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../../api/search.api';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Pagination } from '../../components/products/Pagination';
import { toPersianDigits } from '../../utils/formatPrice';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, page],
    queryFn: () => searchApi.query(q, page),
    enabled: q.length > 0,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-h1 text-text-primary mb-2">
        نتایج جستجو برای: <span className="text-gold-dark">«{q}»</span>
      </h1>
      {data && (
        <p className="text-sm text-text-secondary mb-6">
          {toPersianDigits(data.meta.total)} نتیجه یافت شد
        </p>
      )}

      <ProductGrid products={data?.items} isLoading={isLoading} />

      {data && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={(p) => setSearchParams({ q, page: String(p) })}
        />
      )}
    </div>
  );
}
