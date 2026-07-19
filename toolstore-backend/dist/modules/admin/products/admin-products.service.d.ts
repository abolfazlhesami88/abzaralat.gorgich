import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductSpec } from '../../products/entities/product-spec.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
export interface AdminProductQuery {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: string;
    lowStock?: boolean;
}
export interface CreateProductDto {
    name: string;
    sku: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    stock: number;
    lowStockThreshold?: number;
    weight?: number;
    categoryId?: string;
    brandId?: string;
    status?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    specs?: {
        specKey: string;
        specValue: string;
        sortOrder?: number;
    }[];
    variants?: {
        name: string;
        sku?: string;
        priceModifier?: number;
        stock?: number;
        attributes?: Record<string, string>;
    }[];
}
export declare class AdminProductsService {
    private readonly productRepo;
    private readonly imageRepo;
    private readonly specRepo;
    private readonly variantRepo;
    constructor(productRepo: Repository<Product>, imageRepo: Repository<ProductImage>, specRepo: Repository<ProductSpec>, variantRepo: Repository<ProductVariant>);
    findAll(query: AdminProductQuery): Promise<import("../../../common/dto/pagination.dto").PaginatedResult<Product>>;
    findOne(id: string): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: string, dto: Partial<CreateProductDto>): Promise<Product>;
    remove(id: string): Promise<void>;
    addImage(productId: string, imageData: any, isPrimary?: boolean): Promise<ProductImage>;
    removeImage(imageId: string): Promise<void>;
    reorderImages(productId: string, imageIds: string[]): Promise<void>;
    bulkUpdateStatus(ids: string[], status: string): Promise<{
        updated: number;
    }>;
}
