import { BaseEntity } from '../../../database/entities/base.entity';
import { CouponType } from '../../../common/constants/app.constants';
export declare class Coupon extends BaseEntity {
    code: string;
    type: CouponType;
    value: number;
    minimumOrder: number | null;
    usageLimit: number | null;
    usedCount: number;
    perUserLimit: number;
    isActive: boolean;
    expiresAt: Date | null;
    get isExpired(): boolean;
    get isUsable(): boolean;
}
