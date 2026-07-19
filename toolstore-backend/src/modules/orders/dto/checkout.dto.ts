import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsUUID()
  addressId: string;          // از آدرسهای ثبتشده کاربر (مرحله ۷)

  @IsString()
  paymentMethod: string;      // 'card' | 'transfer' | 'cod'

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
