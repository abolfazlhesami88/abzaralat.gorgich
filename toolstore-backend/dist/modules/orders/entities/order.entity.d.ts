import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus, PaymentStatus } from '../../../common/constants/app.constants';
export declare class Order extends BaseEntity {
    orderNumber: string;
    user: User;
    userId: string | null;
    shippingAddress: {
        fullName: string;
        phone: string;
        province: string;
        city: string;
        addressLine: string;
        postalCode: string;
    };
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    total: number;
    couponCode: string | null;
    notes: string;
    trackingCode: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    items: OrderItem[];
    generateOrderNumber(): void;
}
