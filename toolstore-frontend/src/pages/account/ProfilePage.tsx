import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../api/client';
import { toast } from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
});

type FormData = z.infer<typeof schema>;

export function ProfilePage() {
  const { user, setAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await apiClient.patch('/users/profile', data);
      // Update local user state if necessary
      const newToken = useAuthStore.getState().accessToken;
      if (newToken) {
         // Assuming API returns updated user in res.data.data
         setAuth(res.data.data, newToken);
      }
      toast.success('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'خطا در به‌روزرسانی پروفایل');
    }
  };

  return (
    <div className="bg-white border border-border rounded-card p-6 max-w-2xl">
      <h1 className="font-display text-h2 text-text-primary mb-6">پروفایل کاربری</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">نام</label>
            <input
              {...register('firstName')}
              className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold"
            />
            {errors.firstName && <p className="text-xs text-danger mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">نام خانوادگی</label>
            <input
              {...register('lastName')}
              className="w-full h-11 px-3 border border-border rounded-button text-sm focus:outline-none focus:border-gold"
            />
            {errors.lastName && <p className="text-xs text-danger mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5 text-text-muted">ایمیل (غیرقابل تغییر)</label>
          <input
            disabled
            value={user?.email ?? ''}
            className="w-full h-11 px-3 border border-border rounded-button text-sm bg-gray-50 text-text-muted cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gold hover:bg-gold-hover text-text-primary font-bold px-8 py-3 rounded-button transition-colors disabled:opacity-60 mt-4"
        >
          {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </form>
    </div>
  );
}
