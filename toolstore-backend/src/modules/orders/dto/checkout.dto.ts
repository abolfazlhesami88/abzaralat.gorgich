import { IsUUID, IsString, IsOptional, IsIn, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

// FIX [Pillar 4 — Input Validation]:
// ۱. paymentMethod به whitelist محدود شد — قبلاً هر رشته‌ای قبول می‌شد
// ۲. @MaxLength به notes اضافه شد — جلوگیری از injection با متن بلند
// ۳. couponCode با @Transform نرمال‌سازی می‌شود

const ALLOWED_PAYMENT_METHODS = ['card', 'transfer', 'cod'] as const;

export class CheckoutDto {
  @IsUUID()
  addressId: string; // از آدرس‌های ثبت‌شده کاربر

  // FIX: @IsIn محدود می‌کند به مقادیر مجاز — جلوگیری از تزریق مقادیر دلخواه
  @IsString()
  @IsIn(ALLOWED_PAYMENT_METHODS, {
    message: `روش پرداخت باید یکی از مقادیر زیر باشد: ${ALLOWED_PAYMENT_METHODS.join(', ')}`,
  })
  paymentMethod: string; // 'card' | 'transfer' | 'cod'

  @IsOptional()
  @IsString()
  @MaxLength(50)
  // FIX: couponCode را uppercase می‌کنیم تا case-insensitive باشد
  @Transform(({ value }) => (typeof value === 'string' ? value.toUpperCase().trim() : value))
  couponCode?: string;

  // FIX: @MaxLength جلوگیری از ارسال متن‌های بلند مخرب در notes
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد' })
  notes?: string;
}
