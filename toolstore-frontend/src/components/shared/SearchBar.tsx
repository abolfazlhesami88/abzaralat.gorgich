import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { searchApi } from '../../api/search.api';
import { formatPrice } from '../../utils/formatPrice';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => searchApi.suggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="جستجوی ابزار، برند یا کد محصول..."
          className="w-full h-11 pr-10 pl-4 rounded-pill border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
        />
      </form>

      {isOpen && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-border rounded-card shadow-elevated overflow-hidden z-50 animate-fade-in">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => { navigate(`/products/${item.slug}`); setIsOpen(false); setQuery(''); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gold-light/40 transition-colors text-right"
            >
              {item.image && (
                <img src={import.meta.env.VITE_API_BASE_URL?.replace('/api', '') + item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-text-secondary">{formatPrice(item.price)} تومان</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
