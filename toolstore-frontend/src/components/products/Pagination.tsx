import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatPrice';
import { cn } from '../../utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* دکمه قبلی */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          'flex items-center gap-1 px-3 h-9 text-sm font-medium rounded-xl transition-all duration-150',
          currentPage === 1
            ? 'text-text-muted cursor-not-allowed opacity-40'
            : 'text-text-secondary hover:text-gold-dark hover:bg-gold-light/40 border border-border hover:border-gold/40',
        )}
      >
        <ChevronRight size={15} />
        قبلی
      </button>

      {/* صفحات */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-text-muted select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150',
              currentPage === p
                ? 'bg-gold text-white shadow-[0_2px_8px_rgba(var(--color-gold-rgb),0.35)] scale-105'
                : 'text-text-secondary border border-border hover:border-gold/40 hover:bg-gold-light/30 hover:text-gold-dark',
            )}
          >
            {toPersianDigits(p)}
          </button>
        ),
      )}

      {/* دکمه بعدی */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          'flex items-center gap-1 px-3 h-9 text-sm font-medium rounded-xl transition-all duration-150',
          currentPage === totalPages
            ? 'text-text-muted cursor-not-allowed opacity-40'
            : 'text-text-secondary hover:text-gold-dark hover:bg-gold-light/40 border border-border hover:border-gold/40',
        )}
      >
        بعدی
        <ChevronLeft size={15} />
      </button>
    </div>
  );
}

function getVisiblePages(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}
