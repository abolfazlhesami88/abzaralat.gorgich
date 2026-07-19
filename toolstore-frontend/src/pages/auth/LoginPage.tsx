import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const schema = z.object({
  email: z.string().email('فرمت ایمیل صحیح نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.accessToken);

      await mergeGuestCart();

      const defaultPath = res.user.role === 'admin' ? '/admin' : '/account';
      const from = (location.state as any)?.from ?? defaultPath;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'خطا در ورود');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-white border border-border rounded-card shadow-elevated w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold text-text-primary">
            ToolStore<span className="text-gold">Pro</span>
          </Link>
          <h1 className="text-lg font-semibold text-text-primary mt-4">ورود به حساب کاربری</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">ایمیل</label>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">رمز عبور</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full h-11 px-3 pl-10 border border-border rounded-button text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-gold" />
              <span className="text-text-secondary">مرا به خاطر بسپار</span>
            </label>
            <Link to="/forgot-password" className="text-gold-dark hover:underline">
              فراموشی رمز عبور
            </Link>
          </div>

          {error && (
            <p className="text-xs text-danger bg-danger/10 rounded-button px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-hover text-text-primary font-bold h-11 rounded-button transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="text-gold-dark font-semibold hover:underline">ثبت‌نام</Link>
        </p>
      </div>
    </div>
  );
}
