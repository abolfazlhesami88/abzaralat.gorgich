"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const product_entity_1 = require("../../products/entities/product.entity");
const app_constants_1 = require("../../../common/constants/app.constants");
let DashboardService = class DashboardService {
    orderRepo;
    userRepo;
    productRepo;
    dataSource;
    constructor(orderRepo, userRepo, productRepo, dataSource) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.dataSource = dataSource;
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todayOrders, todayRevenue, totalCustomers, newCustomersToday, lowStockCount, pendingOrders,] = await Promise.all([
            this.orderRepo.count({
                where: { createdAt: today },
            }),
            this.orderRepo
                .createQueryBuilder('o')
                .select('COALESCE(SUM(o.total), 0)', 'sum')
                .where('o.createdAt >= :today', { today })
                .andWhere('o.paymentStatus = :status', { status: app_constants_1.PaymentStatus.PAID })
                .getRawOne()
                .then((r) => Number(r?.sum ?? 0)),
            this.userRepo.count({ where: { role: app_constants_1.UserRole.CUSTOMER } }),
            this.userRepo.count({
                where: { role: app_constants_1.UserRole.CUSTOMER, createdAt: today },
            }),
            this.productRepo
                .createQueryBuilder('p')
                .where('p.isActive = true')
                .andWhere('p.stock <= p.lowStockThreshold')
                .andWhere('p.stock > 0')
                .getCount(),
            this.orderRepo.count({ where: { status: app_constants_1.OrderStatus.PENDING } }),
        ]);
        return {
            todayOrders,
            todayRevenue,
            totalCustomers,
            newCustomersToday,
            lowStockCount,
            pendingOrders,
        };
    }
    async getRevenueChart(period = '30d') {
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const from = new Date();
        from.setDate(from.getDate() - days);
        const rows = await this.dataSource.query(`
      SELECT
        DATE(created_at) as date,
        COALESCE(SUM(total), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= $1
        AND payment_status = 'paid'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [from]);
        const result = [];
        for (let i = 0; i < days; i++) {
            const d = new Date(from);
            d.setDate(from.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const found = rows.find((r) => r.date === dateStr);
            result.push({
                date: dateStr,
                revenue: Number(found?.revenue ?? 0),
                orders: Number(found?.orders ?? 0),
            });
        }
        return result;
    }
    async getTopProducts(limit = 5) {
        return this.productRepo.find({
            where: { status: 'active' },
            order: { soldCount: 'DESC' },
            take: limit,
            select: { id: true, name: true, sku: true, soldCount: true, price: true },
        });
    }
    async getLowStockAlerts() {
        return this.productRepo.find({
            where: { status: 'active' },
            relations: { category: true },
            order: { stock: 'ASC' },
        }).then((products) => products.filter((p) => p.stock <= p.lowStockThreshold && p.stock >= 0));
    }
    async getRecentOrders(limit = 8) {
        return this.orderRepo.find({
            order: { createdAt: 'DESC' },
            take: limit,
            select: { id: true, orderNumber: true, status: true, total: true, createdAt: true, userId: true },
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map