import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { UserRole } from '../../../common/constants/app.constants';
export declare class AdminCustomersService {
    private readonly userRepo;
    private readonly orderRepo;
    constructor(userRepo: Repository<User>, orderRepo: Repository<Order>);
    findAll(page?: number, limit?: number, search?: string): Promise<import("../../../common/dto/pagination.dto").PaginatedResult<{
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
        orders: Order[];
        reviews: import("../../reviews/entities/review.entity").Review[];
        wishlistItems: import("../../wishlist/entities/wishlist.entity").Wishlist[];
        notifications: import("../../notifications/entities/notification.entity").Notification[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    getDetail(userId: string): Promise<{
        user: User | null;
        orders: Order[];
    }>;
    toggleActive(userId: string): Promise<User | undefined>;
}
