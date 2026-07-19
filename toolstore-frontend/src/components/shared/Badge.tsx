import { cn } from '../../utils/cn';

type BadgeVariant = 'new' | 'sale' | 'outOfStock' | 'featured';

const variantStyles: Record<BadgeVariant, string> = {
  new: 'bg-gold text-text-primary',
  sale: 'bg-danger text-white',
  outOfStock: 'bg-gray-400 text-white',
  featured: 'bg-gold-dark text-white',
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={cn(
      'px-2 py-1 rounded-badge text-[11px] font-bold uppercase tracking-wide shadow-sm',
      variantStyles[variant],
    )}>
      {children}
    </span>
  );
}
