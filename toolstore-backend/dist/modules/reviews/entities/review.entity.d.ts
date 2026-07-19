import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Review extends BaseEntity {
    product: Product;
    productId: string;
    user: User;
    userId: string | null;
    order: Order;
    orderId: string | null;
    rating: number;
    title: string;
    body: string;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
}
