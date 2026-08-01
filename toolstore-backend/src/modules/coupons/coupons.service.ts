import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { Order } from '../orders/entities/order.entity';
import { CouponType } from '../../common/constants/app.constants';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // اعتبارسنجی کد تخفیف با چک کردن حداقل خرید و سقف استفاده هر کاربر
  async validate(code: string, subtotal: number, userId?: string) {
    const coupon = await this.findActiveByCode(code);

    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      throw new BadRequestException(
        `حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minimumOrder / 10} تومان است`,
      );
    }

    // بررسی محدودیت استفاده‌ی هر کاربر
    if (userId && coupon.perUserLimit) {
      const usedByUser = await this.orderRepo.count({
        where: { userId, couponCode: coupon.code },
      });
      if (usedByUser >= coupon.perUserLimit) {
        throw new BadRequestException('شما قبلاً از این کد تخفیف استفاده کرده‌اید');
      }
    }

    return {
      coupon,
      discountAmount: this.calculateDiscount(coupon, subtotal),
    };
  }

  calculateDiscount(coupon: Coupon, subtotal: number): number {
    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        return Math.round(subtotal * (coupon.value / 100));
      case CouponType.FIXED:
        return Math.min(Number(coupon.value), subtotal);
      case CouponType.FREE_SHIPPING:
        return 0; // shipping discount — Cart / Orders به طور اختصاصی محاسبه میکنند
      default:
        return 0;
    }
  }

  async incrementUsage(couponId: string) {
    await this.couponRepo.increment({ id: couponId }, 'usedCount', 1);
  }

  async findActiveByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });

    if (!coupon) throw new NotFoundException('کد تخفیف یافت نشد یا منقضی شده است');
    if (!coupon.isUsable) throw new BadRequestException('این کد تخفیف قابل استفاده نیست');

    return coupon;
  }
}
