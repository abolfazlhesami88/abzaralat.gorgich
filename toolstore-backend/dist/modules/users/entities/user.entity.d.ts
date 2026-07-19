import { BaseEntity } from '../../../database/entities/base.entity';
import { UserRole } from '../../../common/constants/app.constants';
import { Address } from '../../addresses/entities/address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Notification } from '../../notifications/entities/notification.entity';
export declare class User extends BaseEntity {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatarUrl: string;
    role: UserRole;
    isActive: boolean;
    refreshToken: string | null;
    refreshTokenExpiresAt: Date | null;
    addresses: Address[];
    cart: Cart;
    orders: Order[];
    reviews: Review[];
    wishlistItems: Wishlist[];
    notifications: Notification[];
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    get fullName(): string;
}
