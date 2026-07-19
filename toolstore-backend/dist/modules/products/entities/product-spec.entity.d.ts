import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from './product.entity';
export declare class ProductSpec extends BaseEntity {
    product: Product;
    productId: string;
    specKey: string;
    specValue: string;
    sortOrder: number;
}
