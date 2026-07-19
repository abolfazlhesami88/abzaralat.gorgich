import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from './product.entity';
export declare class ProductVariant extends BaseEntity {
    product: Product;
    productId: string;
    name: string;
    sku: string;
    priceModifier: number;
    stock: number;
    attributes: Record<string, string>;
}
