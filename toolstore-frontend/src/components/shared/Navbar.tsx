import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Wrench } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#ffffff] via-[#fdfbf7] to-[#fbf9f4] border-b border-[#ece4d3] shadow-[0_4px_20px_rgba(34,28,18,0.03)] select-none">
      <div className="container mx-auto px-4">
        {/* ردیف اصلی هدر */}
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* ۱. لوگو و برند "ابزارآلات گرگیچ" */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            {/* مونوگرام گرد سه‌بعدی */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#d9b869] via-[#c79a4b] to-[#a67d34] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(199,154,75,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <Wrench size={20} className="stroke-[2.2]" />
            </div>

            {/* نام برند و تگ‌لاین */}
            <div className="flex flex-col">
              <span className="font-display text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#221c12] via-[#42341d] to-[#c79a4b] bg-clip-text text-transparent">
                ابزارآلات گرگیچ
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-[#c79a4b] tracking-[0.25em] uppercase -mt-0.5 opacity-90">
                GORGICH TOOLS
              </span>
            </div>
          </Link>

          {/* ۲. سرچ‌بار دسکتاپ (وسط، عریض) */}
          <div className="hidden md:block flex-1 max-w-xl mx-2">
            <SearchBar />
          </div>

          {/* ۳. آیکون‌ها (سمت چپ) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* علاقه مندی ها */}
            <button
              onClick={() => navigate(isAuthenticated ? '/account/wishlist' : '/login')}
              className="hidden sm:flex w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#ffffff] to-[#f7f3ec] border border-[#ece4d3] shadow-[0_2px_6px_rgba(34,28,18,0.04)] items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_4px_12px_rgba(199,154,75,0.18)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={19} />
            </button>

            {/* سبد خرید */}
            <button
              onClick={() => navigate('/cart')}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#ffffff] to-[#f7f3ec] border border-[#ece4d3] shadow-[0_2px_6px_rgba(34,28,18,0.04)] flex items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_4px_12px_rgba(199,154,75,0.18)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="سبد خرید"
            >
              <ShoppingCart size={19} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -left-1 px-1.5 min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#c79a4b] to-[#d9b869] text-[#221c12] text-[10px] font-extrabold flex items-center justify-center shadow-[0_2px_8px_rgba(199,154,75,0.4)] border border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* حساب کاربری */}
            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-gradient-to-b from-[#ffffff] to-[#f7f3ec] border border-[#ece4d3] shadow-[0_2px_6px_rgba(34,28,18,0.04)] flex items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_4px_12px_rgba(199,154,75,0.18)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="حساب کاربری"
            >
              <User size={19} />
            </button>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-[14px] bg-gradient-to-b from-[#ffffff] to-[#f7f3ec] border border-[#ece4d3] flex items-center justify-center text-[#221c12]"
              aria-label="منو"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* سرچ‌بار در حالت موبایل (زیر لوگو و آیکون‌ها) */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* کشوی منوی موبایل */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#ece4d3] bg-[#fdfbf7] animate-slide-up">
          <nav className="flex flex-col p-2">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-[#221c12] hover:bg-[#f4efe4] hover:text-[#c79a4b] transition-colors"
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
