import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class ApplyCouponDto {
  @IsString()
  couponCode: string;
}
