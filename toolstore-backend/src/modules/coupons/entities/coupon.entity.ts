import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { CouponType } from '../../../common/constants/app.constants';

@Entity('coupons')
export class Coupon extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 50 })
  code: string;

  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'minimum_order', type: 'bigint', nullable: true })
  minimumOrder: number | null;

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit: number | null;

  @Column({ name: 'used_count', default: 0 })
  usedCount: number;

  @Column({ name: 'per_user_limit', default: 1 })
  perUserLimit: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  get isUsable(): boolean {
    if (!this.isActive || this.isExpired) return false;
    if (this.usageLimit !== null && this.usedCount >= this.usageLimit) return false;
    return true;
  }
}
