import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Brand } from '../modules/brands/entities/brand.entity';
import { Product } from '../modules/products/entities/product.entity';
import { ProductImage } from '../modules/products/entities/product-image.entity';
import { ProductVariant } from '../modules/products/entities/product-variant.entity';
import { ProductSpec } from '../modules/products/entities/product-spec.entity';
import { Address } from '../modules/addresses/entities/address.entity';
import { Cart } from '../modules/cart/entities/cart.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { Coupon } from '../modules/coupons/entities/coupon.entity';
import { Wishlist } from '../modules/wishlist/entities/wishlist.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';

const entities = [
  User, Category, Brand,
  Product, ProductImage, ProductVariant, ProductSpec,
  Address, Cart, CartItem,
  Order, OrderItem,
  Review, Coupon, Wishlist, Notification,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities,
        migrations: [__dirname + '/migrations/**/*.{ts,js}'],
        synchronize: config.get('DB_SYNCHRONIZE') === 'true',
        logging: config.get('DB_LOGGING') === 'true',
        ssl: config.get('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
