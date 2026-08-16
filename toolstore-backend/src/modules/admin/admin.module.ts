import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { ProductSpec } from '../products/entities/product-spec.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Review } from '../reviews/entities/review.entity';

// Controllers
import { DashboardController } from './dashboard/dashboard.controller';
import { AdminProductsController } from './products/admin-products.controller';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminCustomersController } from './customers/admin-customers.controller';
import { AdminCategoriesController } from './categories/admin-categories.controller';
import { AdminBrandsController } from './brands/admin-brands.controller';
import { AdminCouponsController } from './coupons/admin-coupons.controller';
import { AdminReviewsController } from './reviews/admin-reviews.controller';

// Services
import { DashboardService } from './dashboard/dashboard.service';
import { AdminProductsService } from './products/admin-products.service';
import { AdminCustomersService } from './customers/admin-customers.service';

// Modules
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { OrdersModule } from '../orders/orders.module';
import { CouponsModule } from '../coupons/coupons.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { UploadModule } from '../upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, ProductImage, ProductSpec, ProductVariant,
      Order, User, Category, Brand, Coupon, Review,
    ]),
    ProductsModule, CategoriesModule, BrandsModule,
    OrdersModule, CouponsModule, ReviewsModule,
    UploadModule, NotificationsModule,
  ],
  controllers: [
    DashboardController,
    AdminProductsController,
    AdminOrdersController,
    AdminCustomersController,
    AdminCategoriesController,
    AdminBrandsController,
    AdminCouponsController,
    AdminReviewsController,
  ],
  providers: [DashboardService, AdminProductsService, AdminCustomersService],
})
export class AdminModule {}
