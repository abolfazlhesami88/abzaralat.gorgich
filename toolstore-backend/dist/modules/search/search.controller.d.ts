import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(q: string, page?: number, limit?: number): Promise<{
        data: {
            items: import("../products/entities/product.entity").Product[];
            meta: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
            };
            query: string;
        };
    }>;
    suggestions(q: string): Promise<{
        data: {
            id: string;
            name: string;
            slug: string;
            price: number;
            image: string | null;
        }[];
    }>;
}
