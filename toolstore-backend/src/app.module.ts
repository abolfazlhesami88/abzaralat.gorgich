import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import configuration from './config/configuration';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { SearchModule } from './modules/search/search.module';
import { UploadModule } from './modules/upload/upload.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Config — باید اول لود شود
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: config.get('THROTTLE_TTL', 60) * 1000,
        limit: config.get('THROTTLE_LIMIT', 100),
      }]),
    }),

    // Database
    DatabaseModule,

    // Modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    SearchModule,
    UploadModule,
    ReviewsModule,
    CartModule,
    OrdersModule,
    CouponsModule,
    AddressesModule,
    WishlistModule,
    NotificationsModule,
    AdminModule,
  ],
  providers: [
    // Global Guards — ترتیب مهم است
    { provide: APP_GUARD, useClass: JwtAuthGuard },   // اول: بررسی JWT
    { provide: APP_GUARD, useClass: ThrottlerGuard }, // دوم: Rate Limit
    { provide: APP_GUARD, useClass: RolesGuard },     // سوم: Role Check

    // Global Filter
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    // Global Interceptors — ترتیب مهم است
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }, // اول: Log
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }, // دوم: Transform
  ],
})
export class AppModule {}
