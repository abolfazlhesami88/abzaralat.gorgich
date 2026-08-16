import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره موبایل کاربر (۱۱ رقم)' })
  @IsString()
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'کد تأیید ۶ رقمی دریافت شده via SMS' })
  @IsString()
  @IsNotEmpty({ message: 'کد تأیید الزامی است' })
  @Length(6, 6, { message: 'کد تأیید باید دقیقاً ۶ رقم باشد' })
  code: string;
}
