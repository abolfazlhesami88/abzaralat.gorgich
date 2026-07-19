import { BaseEntity } from '../../../database/entities/base.entity';
import { Product } from '../../products/entities/product.entity';
export declare class Category extends BaseEntity {
    name: string;
    slug: string;
    description: string;
    iconName: string;
    imageUrl: string;
    sortOrder: number;
    isActive: boolean;
    parent: Category;
    parentId: string | null;
    children: Category[];
    products: Product[];
}
