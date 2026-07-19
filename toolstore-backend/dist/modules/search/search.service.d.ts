import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
export declare class SearchService {
    private readonly productRepo;
    constructor(productRepo: Repository<Product>);
    search(query: string, page?: number, limit?: number): Promise<{
        items: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
        query: string;
    }>;
    suggestions(query: string, limit?: number): Promise<{
        id: string;
        name: string;
        slug: string;
        price: number;
        image: string | null;
    }[]>;
}
