import { IsNotEmpty, IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Transform } from 'class-transformer';

function normalizePhoneStr(phone: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits  = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let str = phone.trim();
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianDigits[i], 'g'), String(i));
    str = str.replace(new RegExp(arabicDigits[i], 'g'), String(i));
  }
  if (str.startsWith('+98')) str = '0' + str.slice(3);
  if (str.startsWith('0098')) str = '0' + str.slice(4);
  if (str.startsWith('98') && str.length === 12) str = '0' + str.slice(2);
  return str;
}

@ValidatorConstraint({ name: 'isEmailOrPhone', async: false })
export class IsEmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(text: string, _args?: ValidationArguments) {
    if (typeof text !== 'string') return false;
    const clean = text.trim();
    if (!clean) return false;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    const normalizedPhone = normalizePhoneStr(clean);
    const isPhone = /^09\d{9}$/.test(normalizedPhone);
    return isEmail || isPhone;
  }

  defaultMessage(_args?: ValidationArguments) {
    return 'شناسه ورود باید یک ایمیل معتبر یا شماره موبایل معتبر باشد (مثال: 09123456789 یا user@example.com)';
  }
}

export class LoginDto {
  @IsNotEmpty({ message: 'ایمیل یا شماره موبایل الزامی است' })
  @IsString()
  @Validate(IsEmailOrPhoneConstraint)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  identifier: string;

  @IsString({ message: 'رمز عبور الزامی است' })
  password: string;
}
