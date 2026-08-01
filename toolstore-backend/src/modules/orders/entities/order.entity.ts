import {
  Entity, Column, ManyToOne, OneToMany,
  JoinColumn, Index,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus, PaymentStatus } from '../../../common/constants/app.constants';

@Entity('orders')
export class Order extends BaseEntity {
  @Index({ unique: true })
  @Column({ name: 'order_number', length: 20 })
  orderNumber: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddress: {
    fullName: string;
    phone: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
  };

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column({ type: 'bigint' })
  subtotal: number;

  @Column({ name: 'discount_amount', type: 'bigint', default: 0 })
  discountAmount: number;

  @Column({ name: 'shipping_cost', type: 'bigint', default: 0 })
  shippingCost: number;

  @Column({ name: 'tax_amount', type: 'bigint', default: 0 })
  taxAmount: number;

  @Column({ type: 'bigint' })
  total: number;

  @Column({ name: 'coupon_code', type: 'varchar', length: 50, nullable: true })
  couponCode: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'tracking_code', type: 'varchar', length: 100, nullable: true })
  trackingCode: string | null;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];
}
