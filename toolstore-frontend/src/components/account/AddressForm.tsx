import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddresses, useCreateAddress, useUpdateAddress } from '../../hooks/useAddresses';

const schema = z.object({
  label: z.string().max(50).optional(),
  fullName: z.string().min(3, 'نام گیرنده باید حداقل ۳ کاراکتر باشد'),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست'),
  province: z.string().min(2, 'استان الزامی است'),
  city: z.string().min(2, 'شهر الزامی است'),
  addressLine: z.string().min(10, 'آدرس دقیق الزامی است'),
  postalCode: z.string().regex(/^[0-9]{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function AddressForm({ addressId, onSuccess, onCancel }: { addressId?: string | null, onSuccess: () => void, onCancel: () => void }) {
  const { data: addresses } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const existingAddress = addressId ? addresses?.find(a => a.id === addressId) : null;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingAddress ? {
      label: existingAddress.label || '',
      fullName: existingAddress.fullName,
      phone: existingAddress.phone,
      province: existingAddress.province,
      city: existingAddress.city,
      addressLine: existingAddress.addressLine,
      postalCode: existingAddress.postalCode,
      isDefault: existingAddress.isDefault,
    } : { isDefault: false },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (addressId) {
        await updateAddress.mutateAsync({ id: addressId, data: { ...data, label: data.label || null } });
      } else {
        await createAddress.mutateAsync({ ...data, label: data.label || null });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">عنوان آدرس (اختیاری)</label>
          <input {...register('label')} placeholder="مثال: خانه، محل کار" className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">نام تحویل‌گیرنده</label>
          <input {...register('fullName')} className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none" />
          {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">شماره موبایل</label>
          <input {...register('phone')} className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none text-left dir-ltr" placeholder="09123456789" />
          {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">کد پستی</label>
          <input {...register('postalCode')} className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none text-left dir-ltr" />
          {errors.postalCode && <p className="text-xs text-danger mt-1">{errors.postalCode.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">استان</label>
          <input {...register('province')} className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none" />
          {errors.province && <p className="text-xs text-danger mt-1">{errors.province.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">شهر</label>
          <input {...register('city')} className="w-full h-11 px-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none" />
          {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">آدرس دقیق پستی</label>
        <textarea {...register('addressLine')} className="w-full h-24 p-3 border border-border rounded-button text-sm focus:border-gold focus:outline-none" />
        {errors.addressLine && <p className="text-xs text-danger mt-1">{errors.addressLine.message}</p>}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" {...register('isDefault')} className="accent-gold w-4 h-4" />
        <span className="text-sm font-medium text-text-primary">تنظیم به عنوان آدرس پیش‌فرض</span>
      </label>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isSubmitting} className="flex-1 bg-gold hover:bg-gold-hover text-text-primary font-bold h-11 rounded-button transition-colors disabled:opacity-50">
          {isSubmitting ? 'در حال ثبت...' : 'ثبت آدرس'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 border border-border rounded-button font-medium hover:bg-background transition-colors">
          انصراف
        </button>
      </div>
    </form>
  );
}
