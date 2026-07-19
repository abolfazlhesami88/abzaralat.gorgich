import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Address } from '../addresses/entities/address.entity';
import { Product } from '../products/entities/product.entity';
import { CartService } from '../cart/cart.service';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    private readonly addressRepo;
    private readonly productRepo;
    private readonly cartService;
    private readonly couponsService;
    private readonly notificationsService;
    private readonly dataSource;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, addressRepo: Repository<Address>, productRepo: Repository<Product>, cartService: CartService, couponsService: CouponsService, notificationsService: NotificationsService, dataSource: DataSource);
    checkout(userId: string, dto: CheckoutDto): Promise<Order>;
    findUserOrders(userId: string, page?: number, limit?: number): Promise<import("../../common/dto/pagination.dto").PaginatedResult<Order>>;
    findByOrderNumber(orderNumber: string, userId: string): Promise<Order>;
    cancelOrder(orderNumber: string, userId: string): Promise<Order>;
    private generateOrderNumber;
}
