import { DataSource } from 'typeorm';
import { Coupon } from '../../modules/coupons/entities/coupon.entity';
import { CouponType } from '../../common/constants/app.constants';

export async function seedCoupons(dataSource: DataSource) {
  const repo = dataSource.getRepository(Coupon);
  const existing = await repo.count();
  if (existing > 0) return;

  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(now.getMonth() + 1);

  await repo.save([
    {
      code: 'WELCOME20',
      type: CouponType.PERCENTAGE,
      value: 20,
      minimumOrder: 5000000, // ۵۰۰ هزار تومان
      usageLimit: null,
      perUserLimit: 1,
      isActive: true,
      expiresAt: null,
    },
    {
      code: 'SUMMER_SALE',
      type: CouponType.FIXED,
      value: 10000000, // ۱ میلیون تومان
      minimumOrder: 100000000, // ۱۰ میلیون تومان
      usageLimit: 100,
      perUserLimit: 1,
      isActive: true,
      expiresAt: nextMonth,
    },
    {
      code: 'FREE_SHIP',
      type: CouponType.FREE_SHIPPING,
      value: 0,
      minimumOrder: 20000000, // ۲ میلیون تومان
      usageLimit: 500,
      perUserLimit: 5,
      isActive: true,
      expiresAt: null,
    },
  ]);
}
