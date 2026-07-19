import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    ORDER_CONFIRMED = "order_confirmed",
    ORDER_SHIPPED = "order_shipped",
    ORDER_DELIVERED = "order_delivered",
    ORDER_CANCELLED = "order_cancelled",
    REVIEW_APPROVED = "review_approved",
    PRICE_DROP = "price_drop",
    BACK_IN_STOCK = "back_in_stock",
    SYSTEM = "system"
}
export declare class Notification extends BaseEntity {
    user: User;
    userId: string;
    title: string;
    body: string;
    type: NotificationType;
    isRead: boolean;
    link: string;
}
