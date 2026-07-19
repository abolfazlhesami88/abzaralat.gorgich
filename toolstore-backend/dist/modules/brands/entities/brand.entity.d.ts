import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Brand extends BaseEntity {
    name: string;
    slug: string;
    logoUrl: string;
    description: string;
    countryOfOrigin: string;
    isActive: boolean;
    products: Product[];
}
