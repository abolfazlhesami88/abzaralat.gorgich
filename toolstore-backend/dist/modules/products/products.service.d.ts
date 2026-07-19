import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
export declare class ProductsService {
    private readonly productRepo;
    constructor(productRepo: Repository<Product>);
    findAll(query: QueryProductsDto, includeInactive?: boolean): Promise<import("../../common/dto/pagination.dto").PaginatedResult<Product>>;
    findBySlug(slug: string): Promise<Product>;
    findFeatured(limit?: number): Promise<Product[]>;
    findNewArrivals(limit?: number): Promise<Product[]>;
    findBestSellers(limit?: number): Promise<Product[]>;
    findRelated(slug: string, limit?: number): Promise<Product[]>;
    private buildBaseQuery;
    private applySorting;
    private incrementViewCount;
}
