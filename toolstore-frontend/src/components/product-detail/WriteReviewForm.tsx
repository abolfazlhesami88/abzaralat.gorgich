// Note: We use react-hook-form properly below instead of react-form.
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateReview } from '../../hooks/useReviews';
import { RatingStars } from '../shared/RatingStars';
import { cn } from '../../utils/cn';

const reviewSchema = z.object({
  rating: z.number().min(1, 'امتیاز خود را انتخاب کنید').max(5),
  title: z.string().max(255).optional(),
  body: z.string().min(10, 'متن نظر باید حداقل ۱۰ کاراکتر باشد').max(2000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function WriteReviewForm({ productId, slug, onSuccess }: { productId: string; slug: string; onSuccess: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useHookForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', body: '' },
  });

  const rating = watch('rating');
  const { mutate: submitReview, isPending, isSuccess, error } = useCreateReview(slug);

  const onSubmit = (data: ReviewFormValues) => {
    submitReview(
      { productId, ...data },
      { onSuccess },
    );
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-success/10 text-success rounded-card text-center text-sm font-medium">
        نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">امتیاز شما</label>
        <RatingStars rating={rating} size="lg" interactive onChange={(r) => setValue('rating', r)} />
        {errors.rating && <p className="text-xs text-danger mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">عنوان نظر (اختیاری)</label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 text-sm border border-border rounded-button focus:outline-none focus:border-gold"
          placeholder="خلاصه نظر شما"
        />
        {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">متن نظر</label>
        <textarea
          {...register('body')}
          className="w-full px-4 py-3 text-sm border border-border rounded-button focus:outline-none focus:border-gold min-h-[120px] resize-y"
          placeholder="تجربه استفاده خود از این محصول را بنویسید..."
        />
        {errors.body && <p className="text-xs text-danger mt-1">{errors.body.message}</p>}
      </div>

      {error && <p className="text-sm text-danger font-medium">خطایی در ثبت نظر رخ داد.</p>}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'px-6 py-2.5 bg-gold text-text-primary font-bold rounded-button transition-colors',
          isPending ? 'opacity-50' : 'hover:bg-gold-hover'
        )}
      >
        {isPending ? 'در حال ثبت...' : 'ثبت نظر'}
      </button>
    </form>
  );
}
