import {
  IsString, IsNotEmpty, IsNumber, IsInt, IsOptional,
  IsBoolean, Min, MaxLength, IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductSpecDto {
  @IsString() @IsNotEmpty() specKey: string;
  @IsString() @IsNotEmpty() specValue: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

export class CreateProductVariantDto {
  @IsString() @IsNotEmpty() name: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsNumber() priceModifier?: number;
  @IsOptional() @IsInt() @Min(0) stock?: number;
  @IsOptional() attributes?: Record<string, string>;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'نام محصول الزامی است' })
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'کد محصول (SKU) الزامی است' })
  @MaxLength(100)
  sku: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: 'قیمت باید عدد باشد' })
  @IsPositive({ message: 'قیمت باید بیشتر از صفر باشد' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costPrice?: number;

  @IsInt({ message: 'موجودی باید عدد صحیح باشد' })
  @Min(0, { message: 'موجودی نمی‌تواند منفی باشد' })
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  lowStockThreshold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @Type(() => CreateProductSpecDto)
  specs?: CreateProductSpecDto[];

  @IsOptional()
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
