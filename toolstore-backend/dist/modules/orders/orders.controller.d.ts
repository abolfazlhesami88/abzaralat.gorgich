import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(dto: CheckoutDto, userId: string): Promise<{
        data: import("./entities/order.entity").Order;
    }>;
    findAll(userId: string): Promise<{
        data: import("../../common/dto/pagination.dto").PaginatedResult<import("./entities/order.entity").Order>;
    }>;
    findOne(orderNumber: string, userId: string): Promise<{
        data: import("./entities/order.entity").Order;
    }>;
    cancel(orderNumber: string, userId: string): Promise<{
        data: import("./entities/order.entity").Order;
    }>;
}
