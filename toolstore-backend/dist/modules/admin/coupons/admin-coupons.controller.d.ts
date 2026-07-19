import { Coupon } from '../../coupons/entities/coupon.entity';
import { Repository } from 'typeorm';
export declare class AdminCouponsController {
    private readonly couponRepo;
    constructor(couponRepo: Repository<Coupon>);
    findAll(page?: number, limit?: number): Promise<{
        data: import("../../../common/dto/pagination.dto").PaginatedResult<Coupon>;
    }>;
    create(dto: any): Promise<{
        data: Coupon;
    }>;
    update(id: string, dto: any): Promise<{
        data: Coupon | null;
    }>;
    remove(id: string): Promise<{
        data: null;
    }>;
}
