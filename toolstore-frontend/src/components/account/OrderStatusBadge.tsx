import { cn } from '../../utils/cn';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending:    { label: 'در انتظار تأیید', className: 'bg-warning/10 text-warning' },
  confirmed:  { label: 'تأیید شده',       className: 'bg-blue-50 text-blue-600' },
  processing: { label: 'در حال آماده‌سازی', className: 'bg-blue-50 text-blue-600' },
  shipped:    { label: 'ارسال شده',       className: 'bg-gold-light text-gold-dark' },
  delivered:  { label: 'تحویل داده شده',  className: 'bg-success/10 text-success' },
  cancelled:  { label: 'لغو شده',         className: 'bg-danger/10 text-danger' },
  refunded:   { label: 'مسترد شده',       className: 'bg-gray-100 text-gray-500' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, className: 'bg-gray-100 text-gray-500' };
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-pill', config.className)}>
      {config.label}
    </span>
  );
}
