"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("./entities/coupon.entity");
const app_constants_1 = require("../../common/constants/app.constants");
let CouponsService = class CouponsService {
    couponRepo;
    constructor(couponRepo) {
        this.couponRepo = couponRepo;
    }
    async validate(code, subtotal) {
        const coupon = await this.findActiveByCode(code);
        if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
            throw new common_1.BadRequestException(`حداقل مبلغ سفارش برای استفاده از این کد ${coupon.minimumOrder / 10} تومان است`);
        }
        return {
            coupon,
            discountAmount: this.calculateDiscount(coupon, subtotal),
        };
    }
    calculateDiscount(coupon, subtotal) {
        switch (coupon.type) {
            case app_constants_1.CouponType.PERCENTAGE:
                return Math.round(subtotal * (coupon.value / 100));
            case app_constants_1.CouponType.FIXED:
                return Math.min(Number(coupon.value), subtotal);
            case app_constants_1.CouponType.FREE_SHIPPING:
                return 0;
            default:
                return 0;
        }
    }
    async incrementUsage(couponId) {
        await this.couponRepo.increment({ id: couponId }, 'usedCount', 1);
    }
    async findActiveByCode(code) {
        const coupon = await this.couponRepo.findOne({
            where: { code: code.toUpperCase(), isActive: true },
        });
        if (!coupon)
            throw new common_1.NotFoundException('کد تخفیف یافت نشد یا منقضی شده است');
        if (!coupon.isUsable)
            throw new common_1.BadRequestException('این کد تخفیف قابل استفاده نیست');
        return coupon;
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map