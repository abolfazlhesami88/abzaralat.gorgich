import { BaseEntity } from '../../../database/entities/base.entity';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem extends BaseEntity {
    order: Order;
    orderId: string;
    product: Product;
    productId: string | null;
    productName: string;
    productSku: string;
    productImage: string;
    variantName: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
