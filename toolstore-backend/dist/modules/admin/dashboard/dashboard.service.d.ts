import { Repository, DataSource } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare class DashboardService {
    private readonly orderRepo;
    private readonly userRepo;
    private readonly productRepo;
    private readonly dataSource;
    constructor(orderRepo: Repository<Order>, userRepo: Repository<User>, productRepo: Repository<Product>, dataSource: DataSource);
    getStats(): Promise<{
        todayOrders: number;
        todayRevenue: number;
        totalCustomers: number;
        newCustomersToday: number;
        lowStockCount: number;
        pendingOrders: number;
    }>;
    getRevenueChart(period?: '7d' | '30d' | '90d'): Promise<{
        date: string;
        revenue: number;
        orders: number;
    }[]>;
    getTopProducts(limit?: number): Promise<Product[]>;
    getLowStockAlerts(): Promise<Product[]>;
    getRecentOrders(limit?: number): Promise<Order[]>;
}
