import { IsString, IsOptional, Matches, MaxLength, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  label?: string;

  @IsString()
  @MaxLength(200)
  fullName: string;

  @IsString()
  @Matches(/^09[0-9]{9}$/, { message: 'شماره موبایل معتبر نیست' })
  phone: string;

  @IsString()
  province: string;

  @IsString()
  city: string;

  @IsString()
  addressLine: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'کد پستی باید ۱۰ رقم باشد' })
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
