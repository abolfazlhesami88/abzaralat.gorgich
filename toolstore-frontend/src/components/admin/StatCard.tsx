import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'gold' | 'success' | 'danger' | 'blue' | 'primary';
}

const colorMap = {
  gold: 'bg-gold-light text-gold-dark',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  blue: 'bg-blue-50 text-blue-600',
  primary: 'bg-primary/10 text-primary',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'gold' }: StatCardProps) {
  return (
    <div className="bg-white border border-border rounded-card p-5 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', colorMap[color])}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-text-muted">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-0.5">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-0.5', trend.value >= 0 ? 'text-success' : 'text-danger')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}٪ {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
