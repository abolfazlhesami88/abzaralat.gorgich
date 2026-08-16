import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../../hooks/useDebounce';
import { searchApi } from '../../api/search.api';
import { formatPrice } from '../../utils/formatPrice';
import { getMediaUrl } from '../../utils/media';

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
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="جستجوی ابزار، برند یا کد محصول..."
          className="w-full h-11 sm:h-12 pr-11 pl-4 rounded-full border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-sm placeholder:text-[#8c8272]/70 shadow-[inset_0_2px_5px_rgba(34,28,18,0.05)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_16px_rgba(199,154,75,0.22)] transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c79a4b] hover:text-[#a67d34] transition-colors"
          aria-label="جستجو"
        >
          <Search size={20} />
        </button>
      </form>

      {isOpen && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#fdfcfa] border border-[#ece4d3] rounded-2xl shadow-[0_12px_32px_rgba(34,28,18,0.08)] overflow-hidden z-50 animate-fade-in">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(`/products/${item.slug}`);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-[#f5edd6]/40 transition-colors text-right border-b border-[#ece4d3]/60 last:border-0"
            >
              {item.image && (
                <img
                  src={getMediaUrl(item.image)}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-[#ece4d3]"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#221c12] truncate">{item.name}</p>
                <p className="text-xs font-bold text-[#a67d34] mt-0.5">{formatPrice(item.price)} تومان</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
