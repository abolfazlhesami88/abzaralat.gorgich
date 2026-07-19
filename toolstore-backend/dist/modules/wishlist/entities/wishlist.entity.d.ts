import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Wishlist extends BaseEntity {
    user: User;
    userId: string;
    product: Product;
    productId: string;
}
