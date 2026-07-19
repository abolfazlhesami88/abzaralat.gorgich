import { useNotifications, useMarkAllRead } from '../../hooks/useNotifications';
import { Bell, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markAllRead = useMarkAllRead();

  if (isLoading) return <div className="text-center py-12 text-text-muted">در حال بارگذاری...</div>;

  const notifications = data?.items || [];

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <Bell size={48} className="mx-auto text-border mb-4" />
        <h2 className="font-semibold text-text-primary">هیچ اعلانی ندارید</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-h2 text-text-primary">اطلاع‌رسانی‌ها</h1>
        {(data?.unreadCount || 0) > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="text-sm font-semibold text-gold-dark hover:underline flex items-center gap-1 disabled:opacity-50"
          >
            <CheckCircle size={16} />
            خواندن همه
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif: any) => (
          <div
            key={notif.id}
            className={cn(
              'p-4 rounded-card border transition-colors relative',
              notif.isRead ? 'bg-white border-border' : 'bg-gold-light/10 border-gold/30'
            )}
          >
            {!notif.isRead && (
              <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-gold" />
            )}
            <h3 className={cn('font-semibold text-sm mb-1', notif.isRead ? 'text-text-secondary' : 'text-text-primary')}>
              {notif.title}
            </h3>
            <p className={cn('text-sm', notif.isRead ? 'text-text-muted' : 'text-text-secondary')}>
              {notif.body}
            </p>
            <span className="text-xs text-text-muted mt-2 block">
              {new Date(notif.createdAt).toLocaleString('fa-IR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
