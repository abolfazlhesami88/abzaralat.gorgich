import { PaginationDto } from '../../../common/dto/pagination.dto';
export declare enum ProductSortBy {
    NEWEST = "newest",
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    BEST_SELLING = "best_selling",
    RATING = "rating",
    NAME_ASC = "name_asc"
}
export declare class QueryProductsDto extends PaginationDto {
    categorySlug?: string;
    brandSlug?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStockOnly?: boolean;
    sortBy?: ProductSortBy;
    search?: string;
}
