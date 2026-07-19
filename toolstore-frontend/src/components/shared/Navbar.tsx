import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { SearchBar } from './SearchBar';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../stores/cartStore';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { data: categories } = useCategories();
  const navigate = useNavigate();

  const cartItemCount = useCartStore((state) => state.cart?.itemCount ?? 0);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      {/* نوار اعلان بالا */}
      <div className="bg-text-primary text-white text-center text-xs py-2">
        ارسال رایگان برای خریدهای بالای ۳,۰۰۰,۰۰۰ تومان
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* لوگو */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl font-bold text-text-primary">
              ToolStore<span className="text-gold">Pro</span>
            </span>
          </Link>

          {/* جستجو — دسکتاپ */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* آیکونها */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(isAuthenticated ? '/account/wishlist' : '/login')}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gold-light transition-colors"
              aria-label="علاقهمندیها"
            >
              <Heart size={20} />
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold-light transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-gold text-text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gold-light transition-colors"
              aria-label="حساب کاربری"
            >
              <User size={20} />
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* منوی دستهبندی — دسکتاپ */}
        <nav className="hidden md:flex items-center gap-6 h-12 border-t border-border">
          {categories?.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="text-sm font-medium text-text-secondary hover:text-gold-dark transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* منوی موبایل */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white animate-slide-up">
          <div className="p-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 border-t border-border text-sm font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
