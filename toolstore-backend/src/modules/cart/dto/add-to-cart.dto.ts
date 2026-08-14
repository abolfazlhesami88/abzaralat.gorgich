import { IsUUID, IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddToCartDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  variantId?: string;

  @IsInt()
  @Min(1, { message: 'تعداد باید حداقل ۱ باشد' })
  @Max(100, { message: 'تعداد نمی‌تواند بیشتر از ۱۰۰ باشد' })
  quantity: number;
}

export class ApplyCouponDto {
  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase().trim() : value,
  )
  couponCode: string;
}
