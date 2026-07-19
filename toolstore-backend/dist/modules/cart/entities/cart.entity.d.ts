import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart extends BaseEntity {
    user: User;
    userId: string | null;
    sessionId: string | null;
    items: CartItem[];
    get total(): number;
    get itemCount(): number;
}
