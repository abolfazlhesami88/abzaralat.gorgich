import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductSpec } from './entities/product-spec.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, ProductVariant, ProductSpec]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // مرحله ۶ (Cart/Orders) و ۸ (Admin) به این نیاز دارند
})
export class ProductsModule {}
