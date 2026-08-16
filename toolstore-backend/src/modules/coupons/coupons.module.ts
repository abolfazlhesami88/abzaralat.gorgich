import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Order } from '../orders/entities/order.entity';
import { CouponsService } from './coupons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, Order])],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
