import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    findAll(userId: string): Promise<{
        data: {
            id: string;
            addedAt: Date;
            product: import("../products/entities/product.entity").Product;
        }[];
    }>;
    toggle(userId: string, productId: string): Promise<{
        data: {
            isWishlisted: boolean;
        };
    }>;
    check(userId: string, productId: string): Promise<{
        data: {
            isWishlisted: boolean;
        };
    }>;
    remove(userId: string, productId: string): Promise<{
        data: {
            isWishlisted: boolean;
        };
    }>;
}
