import {
  Entity, Column, OneToOne, OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId: string | null;

  @Column({ name: 'coupon_code', type: 'varchar', length: 100, nullable: true })
  couponCode: string | null;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  get total(): number {
    if (!this.items) return 0;
    return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  get itemCount(): number {
    if (!this.items) return 0;
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
