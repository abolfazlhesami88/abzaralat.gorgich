import {
  IsString, IsOptional, Matches, MaxLength, MinLength, IsBoolean, IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

// FIX [Pillar 4 — Input Validation]:
// province, city, addressLine فاقد @MaxLength بودند — آسیب‌پذیری injection
export class CreateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  fullName: string;

  @IsString()
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل معتبر نیست' })
  phone: string;

  // FIX: @MaxLength اضافه شد
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  province: string;

  // FIX: @MaxLength اضافه شد
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  city: string;

  // FIX: @MaxLength اضافه شد — از injection با آدرس‌های بسیار بلند جلوگیری می‌کند
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  addressLine: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'کد پستی باید ۱۰ رقم باشد' })
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
