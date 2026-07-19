import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '../products/entities/product.entity';
export declare class WishlistService {
    private readonly wishlistRepo;
    private readonly productRepo;
    constructor(wishlistRepo: Repository<Wishlist>, productRepo: Repository<Product>);
    findAll(userId: string): Promise<{
        id: string;
        addedAt: Date;
        product: Product;
    }[]>;
    toggle(userId: string, productId: string): Promise<{
        isWishlisted: boolean;
    }>;
    check(userId: string, productId: string): Promise<{
        isWishlisted: boolean;
    }>;
    getProductIds(userId: string): Promise<string[]>;
    remove(userId: string, productId: string): Promise<{
        isWishlisted: boolean;
    }>;
}
