import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../../common/constants/app.constants';
import { NotificationsService } from '../../notifications/notifications.service';
export declare class AdminOrdersController {
    private readonly orderRepo;
    private readonly notificationsService;
    constructor(orderRepo: Repository<Order>, notificationsService: NotificationsService);
    findAll(page?: number, limit?: number, status?: string, search?: string, from?: string, to?: string): Promise<{
        data: import("../../../common/dto/pagination.dto").PaginatedResult<Order>;
    }>;
    findOne(id: string): Promise<{
        data: Order | null;
    }>;
    updateStatus(id: string, status: OrderStatus, trackingCode?: string): Promise<{
        data: Order;
    } | undefined>;
}
