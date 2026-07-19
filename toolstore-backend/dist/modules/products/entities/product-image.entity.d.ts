import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from './product.entity';
export declare class ProductImage extends BaseEntity {
    product: Product;
    productId: string;
    filename: string;
    originalName: string;
    path: string;
    url: string;
    altText: string;
    sortOrder: number;
    isPrimary: boolean;
}
