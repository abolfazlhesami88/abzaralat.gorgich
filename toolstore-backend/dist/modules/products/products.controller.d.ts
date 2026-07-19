import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductsDto): Promise<{
        data: import("../../common/dto/pagination.dto").PaginatedResult<import("./entities/product.entity").Product>;
    }>;
    findFeatured(limit?: number): Promise<{
        data: import("./entities/product.entity").Product[];
    }>;
    findNewArrivals(limit?: number): Promise<{
        data: import("./entities/product.entity").Product[];
    }>;
    findBestSellers(limit?: number): Promise<{
        data: import("./entities/product.entity").Product[];
    }>;
    findBySlug(slug: string): Promise<{
        data: import("./entities/product.entity").Product;
    }>;
    findRelated(slug: string, limit?: number): Promise<{
        data: import("./entities/product.entity").Product[];
    }>;
}
