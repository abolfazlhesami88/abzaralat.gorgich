import { IsUUID, IsInt, Min, Max, IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsInt()
  @Min(1, { message: 'امتیاز باید حداقل ۱ باشد' })
  @Max(5, { message: 'امتیاز نمیتواند بیشتر از ۵ باشد' })
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsNotEmpty({ message: 'متن نظر الزامی است' })
  @IsString()
  @MaxLength(2000)
  body: string;
}
