import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
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

  // ─── اعتبارسنجی کد تخفیف ────────────────────────────────────────────────────
  // FIX [Pillar 2 — Concurrency]: وقتی manager ارسال می‌شود (checkout)، قفل
  // pessimistic_write روی کوپن گذاشته می‌شود تا استفاده همزمان دو request
  // از یک کوپن one-use جلوگیری شود.
  async validate(code: string, subtotal: number, userId?: string, manager?: EntityManager) {
    const coupon = await this.findActiveByCode(code, manager);

    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      throw new BadRequestException(
        `حداقل مبلغ سفارش برای استفاده از این کد ${Math.round(coupon.minimumOrder / 10).toLocaleString('fa')} تومان است`,
      );
    }

    // FIX [Pillar 1 — Business Logic]: بررسی محدودیت استفاده‌ی هر کاربر
    if (userId && coupon.perUserLimit) {
      const usedByUser = manager
        ? await manager.count(Order, { where: { userId, couponCode: coupon.code } })
        : await this.orderRepo.count({ where: { userId, couponCode: coupon.code } });

      if (usedByUser >= coupon.perUserLimit) {
        throw new BadRequestException('شما قبلاً از این کد تخفیف استفاده کرده‌اید');
      }
    }

    return {
      coupon,
      discountAmount: this.calculateDiscount(coupon, subtotal),
    };
  }

  // ─── محاسبه مقدار تخفیف ──────────────────────────────────────────────────────
  // FIX [Pillar 1 — Financial Integrity]:
  // ۱. تخفیف PERCENTAGE هرگز نمی‌تواند از مبلغ فاکتور بیشتر شود (Math.min)
  // ۲. تخفیف FIXED هرگز نمی‌تواند از مبلغ فاکتور بیشتر شود (Math.min)
  // ۳. نتیجه همیشه >= 0 است (Math.max)
  // ۴. مقدار value برای PERCENTAGE بین 0 و 100 بررسی می‌شود
  calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (subtotal <= 0) return 0;

    switch (coupon.type) {
      case CouponType.PERCENTAGE: {
        // اطمینان از اینکه درصد در بازه معقول است (0-100)
        const safeValue = Math.min(100, Math.max(0, Number(coupon.value)));
        const rawDiscount = Math.round(subtotal * (safeValue / 100));
        // تخفیف هرگز نمی‌تواند از جمع کل بیشتر شود
        return Math.max(0, Math.min(rawDiscount, subtotal));
      }
      case CouponType.FIXED: {
        // تخفیف ثابت نمی‌تواند از جمع کل بیشتر شود
        return Math.max(0, Math.min(Number(coupon.value), subtotal));
      }
      case CouponType.FREE_SHIPPING:
        // مقدار ارسال رایگان در Cart/Orders به طور مجزا محاسبه می‌شود
        return 0;
      default:
        return 0;
    }
  }

  async incrementUsage(couponId: string, manager?: EntityManager) {
    if (manager) {
      await manager.increment(Coupon, { id: couponId }, 'usedCount', 1);
    } else {
      await this.couponRepo.increment({ id: couponId }, 'usedCount', 1);
    }
  }

  // FIX [Pillar 2 — Concurrency]: وقتی manager دارد (checkout transaction)،
  // قفل pessimistic_write می‌گذارد تا دو checkout همزمان نتوانند
  // از یک کوپن one-use استفاده کنند
  async findActiveByCode(code: string, manager?: EntityManager): Promise<Coupon> {
    const repo = manager ? manager.getRepository(Coupon) : this.couponRepo;
    const coupon = await repo.findOne({
      where: { code: code.toUpperCase().trim(), isActive: true },
      ...(manager ? { lock: { mode: 'pessimistic_write' as const } } : {}),
    });

    if (!coupon) throw new NotFoundException('کد تخفیف یافت نشد یا منقضی شده است');

    // FIX: بررسی انقضا و سقف استفاده مجدداً (در صورتی که getter های entity کار نکنند)
    if (coupon.isExpired) {
      throw new BadRequestException('این کد تخفیف منقضی شده است');
    }

    if (!coupon.isUsable) {
      throw new BadRequestException('این کد تخفیف قابل استفاده نیست یا به سقف استفاده رسیده');
    }

    return coupon;
  }
}
