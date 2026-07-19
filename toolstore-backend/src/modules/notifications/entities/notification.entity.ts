import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  ORDER_CONFIRMED  = 'order_confirmed',
  ORDER_SHIPPED    = 'order_shipped',
  ORDER_DELIVERED  = 'order_delivered',
  ORDER_CANCELLED  = 'order_cancelled',
  REVIEW_APPROVED  = 'review_approved',
  PRICE_DROP       = 'price_drop',
  BACK_IN_STOCK    = 'back_in_stock',
  SYSTEM           = 'system',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ nullable: true })
  link: string;
}
