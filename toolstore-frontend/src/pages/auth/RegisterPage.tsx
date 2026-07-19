import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';

const schema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('فرمت ایمیل صحیح نیست'),
  password: z.string()
    .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'باید شامل حروف بزرگ، کوچک و عدد باشد'),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register(data);
      setAuth(res.user, res.accessToken);
      navigate('/account');
    } catch (err: any) {
      setError('email', { message: err?.response?.data?.message ?? 'خطا در ثبت‌نام' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-border rounded-card shadow-elevated w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold text-text-primary">
            ToolStore<span className="text-gold">Pro</span>
          </Link>
          <h1 className="text-lg font-semibold text-text-primary mt-4">ساخت حساب کاربری</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">نام</label>
              <input {...register('firstName')} placeholder="علی" className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold" />
              {errors.firstName && <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">نام خانوادگی</label>
              <input {...register('lastName')} placeholder="احمدی" className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold" />
              {errors.lastName && <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">ایمیل</label>
            <input {...register('email')} type="email" placeholder="your@email.com" className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold" />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">رمز عبور</label>
            <input {...register('password')} type="password" placeholder="••••••••" className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold" />
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold-hover text-text-primary font-bold h-11 rounded-button transition-colors disabled:opacity-60">
            {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          حساب دارید؟{' '}
          <Link to="/login" className="text-gold-dark font-semibold hover:underline">ورود</Link>
        </p>
      </div>
    </div>
  );
}
