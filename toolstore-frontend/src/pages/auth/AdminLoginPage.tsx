import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { AuthBrandPanel } from '../../components/auth/AuthBrandPanel';

const schema = z.object({
  email: z.string().email('فرمت ایمیل صحیح نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

type FormData = z.infer<typeof schema>;

export function AdminLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await authApi.login(data);

      if (res.user.role !== 'admin') {
        logout();
        setError('این حساب کاربری دسترسی ادمین/مدیریت ندارد.');
        return;
      }

      setAuth(res.user, res.accessToken);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'خطا در ورود. لطفاً اطلاعات ادمین را بررسی کنید.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] flex flex-col lg:flex-row select-none">
      {/* نیمه راست — پنل برند هویتی */}
      <AuthBrandPanel />

      {/* نیمه چپ — فرم ورود ادمین */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        {/* دکمه بازگشت به خانه */}
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#8c8272] hover:text-[#c79a4b] transition-colors"
        >
          <span>بازگشت به سایت اصلی</span>
          <ArrowRight size={15} />
        </Link>

        <div className="w-full max-w-md my-auto py-6">
          {/* عنوان فرم ورود ادمین */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f5edd6] border border-[#d9b869]/30 text-[#a67d34] text-xs font-extrabold mb-3 shadow-sm">
              <ShieldCheck size={16} />
              <span>ورود به پنل مدیریت (/adminsite)</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#221c12]">
              ورود مدیران سیستم
            </h1>
            <p className="text-sm text-[#8c8272] mt-2 font-normal">
              لطفاً پست الکترونیک و رمز عبور مدیریتی خود را وارد نمایید
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* ایمیل ادمین */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#221c12] block mb-1.5">
                ایمیل مدیر *
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@gorgich.com"
                dir="ltr"
                className="w-full h-11 sm:h-12 px-4 rounded-[13px] border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-sm placeholder:text-[#8c8272]/50 shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_14px_rgba(199,154,75,0.22)] transition-all duration-200"
              />
              {errors.email && <p className="text-xs text-danger mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* رمز عبور ادمین */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-[#221c12] block mb-1.5">
                رمز عبور مدیریتی *
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full h-11 sm:h-12 pr-4 pl-11 rounded-[13px] border border-[#ece4d3] bg-[#faf7f2] text-[#221c12] text-sm placeholder:text-[#8c8272]/50 shadow-[inset_0_2px_4px_rgba(34,28,18,0.04)] focus:outline-none focus:border-[#c79a4b] focus:bg-white focus:shadow-[0_0_14px_rgba(199,154,75,0.22)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8272] hover:text-[#c79a4b] transition-colors p-1"
                  aria-label="نمایش رمز عبور"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* پیغام خطا */}
            {error && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-[11px] px-4 py-2.5 font-medium leading-relaxed">
                {error}
              </div>
            )}

            {/* دکمه ورود ادمین */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#c79a4b] via-[#d9b869] to-[#c79a4b] text-[#221c12] font-extrabold text-sm sm:text-base rounded-[13px] shadow-[0_4px_18px_rgba(199,154,75,0.35)] hover:shadow-[0_6px_26px_rgba(199,154,75,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock size={18} />
              <span>{isSubmitting ? 'در حال تایید اعتبار...' : 'ورود به پنل ادمین'}</span>
            </button>
          </form>

          {/* توضیح امنیتی */}
          <div className="mt-8 pt-6 border-t border-[#ece4d3] text-center">
            <p className="text-xs text-[#8c8272] leading-relaxed">
              🔒 این صفحه صرفاً برای مدیران سیستم ابزارآلات گرگیچ است. تمامی تلاش‌های ورود ثبت و پایش می‌شوند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
