import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
export declare class CouponsService {
    private readonly couponRepo;
    constructor(couponRepo: Repository<Coupon>);
    validate(code: string, subtotal: number): Promise<{
        coupon: Coupon;
        discountAmount: number;
    }>;
    calculateDiscount(coupon: Coupon, subtotal: number): number;
    incrementUsage(couponId: string): Promise<void>;
    findActiveByCode(code: string): Promise<Coupon>;
}
