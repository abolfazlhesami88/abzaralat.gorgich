import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, MapPin, ShoppingBag, Heart, Bell, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/auth.api';
import { cn } from '../utils/cn';
import { useNotificationCount } from '../hooks/useNotifications';

const NAV_ITEMS = [
  { to: '/account', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { to: '/account/profile', label: 'پروفایل', icon: User },
  { to: '/account/addresses', label: 'آدرس‌ها', icon: MapPin },
  { to: '/account/orders', label: 'سفارشات', icon: ShoppingBag },
  { to: '/account/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
  { to: '/account/notifications', label: 'اطلاع‌رسانی‌ها', icon: Bell },
];

export function AccountLayout() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationCount();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout().catch(() => {});
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* سایدبار */}
        <aside className="lg:w-64 shrink-0">
          {/* کارت پروفایل */}
          <div className="bg-white border border-border rounded-card p-5 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center text-gold-dark font-bold text-lg shrink-0 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-text-primary truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>

          {/* ناوبری */}
          <nav className="bg-white border border-border rounded-card overflow-hidden">
            {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 text-sm border-b border-border last:border-0 transition-colors',
                  isActive
                    ? 'bg-gold-light text-gold-dark font-semibold border-r-2 border-r-gold'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary',
                )}
              >
                <Icon size={18} />
                {label}
                {label === 'اطلاع‌رسانی‌ها' && unreadCount > 0 && (
                  <span className="mr-auto bg-gold text-text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors"
            >
              <LogOut size={18} />
              خروج از حساب
            </button>
          </nav>
        </aside>

        {/* محتوا */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
