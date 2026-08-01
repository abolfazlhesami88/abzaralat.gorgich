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
    <header className="sticky top-0 z-50 bg-[#fdfcfa]/95 backdrop-blur-md border-b border-[#ece4d3] shadow-[0_4px_25px_rgba(34,28,18,0.03)] select-none">
      <div className="container mx-auto px-4">
        {/* ردیف اصلی هدر: چیدمان راست به چپ */}
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* ۱. لوگو و برند (سمت راست‌ترین قسمت) */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {/* نشان (مونوگرام) گرد ۳بعدی */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d9b869] via-[#c79a4b] to-[#a67d34] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(199,154,75,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <Wrench size={21} className="stroke-[2.2]" />
            </div>

            {/* نام برند و تگ‌لاین لاتین */}
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#221c12] via-[#a67d34] to-[#c79a4b] bg-clip-text text-transparent">
                ابزارآلات گرگیچ
              </span>
              <span className="hidden sm:block text-[9px] font-extrabold text-[#c79a4b] tracking-[0.25em] uppercase -mt-0.5 opacity-95">
                GORGICH TOOLS
              </span>
            </div>
          </Link>

          {/* ۲. سرچ‌بار دسکتاپ (وسط و عریض) */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* ۳. آیکون‌های اکشن (سمت چپ‌ترین قسمت) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* علاقه‌مندی‌ها */}
            <button
              onClick={() => navigate(isAuthenticated ? '/account/wishlist' : '/login')}
              className="hidden sm:flex w-11 h-11 rounded-[16px] bg-gradient-to-b from-[#ffffff] to-[#f9f6f0] border border-[#ece4d3] shadow-[0_2px_8px_rgba(34,28,18,0.04)] items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_6px_18px_rgba(199,154,75,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={19} />
            </button>

            {/* سبد خرید با نقطه/بج طلایی */}
            <button
              onClick={() => navigate('/cart')}
              className="relative w-11 h-11 rounded-[16px] bg-gradient-to-b from-[#ffffff] to-[#f9f6f0] border border-[#ece4d3] shadow-[0_2px_8px_rgba(34,28,18,0.04)] flex items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_6px_18px_rgba(199,154,75,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="سبد خرید"
            >
              <ShoppingCart size={19} />
              {/* نقطه درخشان نوتیفیکیشن / بج سبد خرید */}
              {cartItemCount > 0 ? (
                <span className="absolute -top-1 -left-1 px-1.5 min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] text-[10px] font-extrabold flex items-center justify-center shadow-[0_2px_8px_rgba(199,154,75,0.5)] border border-white">
                  {cartItemCount}
                </span>
              ) : (
                <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#c79a4b] shadow-[0_0_8px_rgba(199,154,75,0.8)]" />
              )}
            </button>

            {/* حساب کاربری */}
            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className="w-11 h-11 rounded-[16px] bg-gradient-to-b from-[#ffffff] to-[#f9f6f0] border border-[#ece4d3] shadow-[0_2px_8px_rgba(34,28,18,0.04)] flex items-center justify-center text-[#221c12] hover:text-[#c79a4b] hover:border-[#c79a4b]/60 hover:shadow-[0_6px_18px_rgba(199,154,75,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              aria-label="حساب کاربری"
            >
              <User size={19} />
            </button>

            {/* دکمه منوی موبایل */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-11 h-11 rounded-[16px] bg-gradient-to-b from-[#ffffff] to-[#f9f6f0] border border-[#ece4d3] flex items-center justify-center text-[#221c12]"
              aria-label="منو"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* سرچ‌بار در حالت موبایل (انتقال به ردیف بعدی) */}
        <div className="md:hidden pb-3.5">
          <SearchBar />
        </div>
      </div>

      {/* کشوی منوی موبایل */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#ece4d3] bg-[#fdfcfa] animate-slide-up">
          <nav className="flex flex-col p-3 space-y-1">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-[#221c12] hover:bg-[#f5edd6]/50 hover:text-[#c79a4b] transition-colors"
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
