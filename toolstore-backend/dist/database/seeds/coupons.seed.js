"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCoupons = seedCoupons;
const coupon_entity_1 = require("../../modules/coupons/entities/coupon.entity");
const app_constants_1 = require("../../common/constants/app.constants");
async function seedCoupons(dataSource) {
    const repo = dataSource.getRepository(coupon_entity_1.Coupon);
    const existing = await repo.count();
    if (existing > 0)
        return;
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);
    await repo.save([
        {
            code: 'WELCOME20',
            type: app_constants_1.CouponType.PERCENTAGE,
            value: 20,
            minimumOrder: 5000000,
            usageLimit: null,
            perUserLimit: 1,
            isActive: true,
            expiresAt: null,
        },
        {
            code: 'SUMMER_SALE',
            type: app_constants_1.CouponType.FIXED,
            value: 10000000,
            minimumOrder: 100000000,
            usageLimit: 100,
            perUserLimit: 1,
            isActive: true,
            expiresAt: nextMonth,
        },
        {
            code: 'FREE_SHIP',
            type: app_constants_1.CouponType.FREE_SHIPPING,
            value: 0,
            minimumOrder: 20000000,
            usageLimit: 500,
            perUserLimit: 5,
            isActive: true,
            expiresAt: null,
        },
    ]);
}
//# sourceMappingURL=coupons.seed.js.map