import { AdminCustomersService } from './admin-customers.service';
import { UserRole } from '../../../common/constants/app.constants';
export declare class AdminCustomersController {
    private readonly service;
    constructor(service: AdminCustomersService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: import("../../../common/dto/pagination.dto").PaginatedResult<{
            orderCount: number;
            totalSpent: number;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatarUrl: string;
            role: UserRole;
            isActive: boolean;
            refreshToken: string | null;
            refreshTokenExpiresAt: Date | null;
            addresses: import("../../addresses/entities/address.entity").Address[];
            cart: import("../../cart/entities/cart.entity").Cart;
            orders: import("../../orders/entities/order.entity").Order[];
            reviews: import("../../reviews/entities/review.entity").Review[];
            wishlistItems: import("../../wishlist/entities/wishlist.entity").Wishlist[];
            notifications: import("../../notifications/entities/notification.entity").Notification[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }>;
    }>;
    getDetail(id: string): Promise<{
        data: {
            user: import("../../users/entities/user.entity").User | null;
            orders: import("../../orders/entities/order.entity").Order[];
        };
    }>;
    toggleActive(id: string): Promise<{
        data: import("../../users/entities/user.entity").User | undefined;
    }>;
}
