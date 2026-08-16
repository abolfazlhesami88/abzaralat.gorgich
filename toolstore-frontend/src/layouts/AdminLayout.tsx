import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Star,
  FolderOpen, Award, LogOut, Menu, ChevronRight, Bell, Palette,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/auth.api';
import { cn } from '../utils/cn';

const NAV = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'محصولات', icon: Package },
  { to: '/admin/orders', label: 'سفارشات', icon: ShoppingBag },
  { to: '/admin/customers', label: 'مشتریان', icon: Users },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderOpen },
  { to: '/admin/brands', label: 'برندها', icon: Award },
  { to: '/admin/coupons', label: 'کدهای تخفیف', icon: Tag },
  { to: '/admin/reviews', label: 'نظرات', icon: Star },
  { to: '/admin/design', label: 'طراحی', icon: Palette },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout().catch(() => {});
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" dir="rtl">
      {/* سایدبار */}
      <aside className={cn(
        'bg-text-primary text-white flex flex-col transition-all duration-300 shrink-0 z-20',
        sidebarOpen ? 'w-60' : 'w-16',
      )}>
        {/* لوگو */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
          {sidebarOpen && (
            <span className="font-display font-bold text-lg whitespace-nowrap overflow-hidden">
              ToolStore<span className="text-gold">Pro</span>
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/60 hover:text-white shrink-0 mx-auto">
            {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* منو */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-gold/20 text-gold border-r-2 border-gold'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer سایدبار */}
        <div className="border-t border-white/10 p-4 shrink-0 overflow-hidden">
          {sidebarOpen && (
            <p className="text-xs text-white/40 mb-3 truncate">
              {user?.firstName} {user?.lastName}
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-danger transition-colors w-full"
            title={!sidebarOpen ? 'خروج' : undefined}
          >
            <LogOut size={16} className="shrink-0 mx-auto sm:mx-0" />
            {sidebarOpen && 'خروج'}
          </button>
        </div>
      </aside>

      {/* محتوا */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <h1 className="font-semibold text-text-primary hidden sm:block">پنل مدیریت</h1>
          {!sidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="sm:hidden text-text-primary mr-2">
                <Menu size={24} />
             </button>
          )}
          <div className="flex items-center gap-3 mr-auto sm:mr-0">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-background">
              <Bell size={18} className="text-text-secondary" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gold-light flex items-center justify-center text-gold-dark font-bold text-sm shrink-0">
              {user?.firstName?.[0]}
            </div>
          </div>
        </header>

        {/* صفحه */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
