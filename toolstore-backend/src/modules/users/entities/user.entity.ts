import { Entity, Column, BeforeInsert, Index, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserRole } from '../../../common/constants/app.constants';
import { Address } from '../../addresses/entities/address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', unique: true, length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  @Exclude() // هیچوقت در response برنمیگردد
  passwordHash: string | null;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: true })
  @Exclude()
  refreshToken: string | null;

  @Column({ name: 'refresh_token_expires_at', type: 'timestamp', nullable: true })
  @Exclude()
  refreshTokenExpiresAt: Date | null;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlistItems: Wishlist[];

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @BeforeInsert()
  async hashPassword() {
    if (this.passwordHash) {
      this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.passwordHash) return false;
    return bcrypt.compare(password, this.passwordHash);
  }

  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.phone || 'کاربر گرگیج';
  }
}
