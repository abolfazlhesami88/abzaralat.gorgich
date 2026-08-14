import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره موبایل کاربر (۱۱ رقم)' })
  @IsString()
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  // FIX [Pillar 4 — Input Validation]:
  // قبلاً regex فقط ارقام انگلیسی قبول می‌کرد.
  // حالا: @MaxLength محدودیت طول دارد و normalize+validate در auth.service انجام می‌شود
  // که ارقام فارسی/عربی را هم پشتیبانی می‌کند.
  // یک regex سخت اینجا ارقام فارسی را رد می‌کرد (UX بد)؛
  // اعتبارسنجی نهایی در normalizeAndValidatePhone() است.
  @MaxLength(20, { message: 'شماره موبایل نامعتبر است' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone: string;
}
