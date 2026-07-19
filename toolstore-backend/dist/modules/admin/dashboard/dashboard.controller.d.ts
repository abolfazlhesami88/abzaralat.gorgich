import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        data: {
            todayOrders: number;
            todayRevenue: number;
            totalCustomers: number;
            newCustomersToday: number;
            lowStockCount: number;
            pendingOrders: number;
        };
    }>;
    getRevenue(period?: '7d' | '30d' | '90d'): Promise<{
        data: {
            date: string;
            revenue: number;
            orders: number;
        }[];
    }>;
    getTopProducts(): Promise<{
        data: import("../../products/entities/product.entity").Product[];
    }>;
    getLowStock(): Promise<{
        data: import("../../products/entities/product.entity").Product[];
    }>;
    getRecentOrders(): Promise<{
        data: import("../../orders/entities/order.entity").Order[];
    }>;
}
