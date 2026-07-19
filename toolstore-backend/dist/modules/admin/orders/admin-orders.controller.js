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
exports.AdminOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const app_constants_1 = require("../../../common/constants/app.constants");
const notifications_service_1 = require("../../notifications/notifications.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
let AdminOrdersController = class AdminOrdersController {
    orderRepo;
    notificationsService;
    constructor(orderRepo, notificationsService) {
        this.orderRepo = orderRepo;
        this.notificationsService = notificationsService;
    }
    async findAll(page = 1, limit = 20, status, search, from, to) {
        const qb = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .orderBy('order.createdAt', 'DESC');
        if (status)
            qb.andWhere('order.status = :status', { status });
        if (search)
            qb.andWhere('order.orderNumber ILIKE :s', { s: `%${search}%` });
        if (from)
            qb.andWhere('order.createdAt >= :from', { from: new Date(from) });
        if (to)
            qb.andWhere('order.createdAt <= :to', { to: new Date(to) });
        const [items, total] = await qb
            .skip((Number(page) - 1) * Number(limit))
            .take(Number(limit))
            .getManyAndCount();
        return { data: (0, pagination_dto_1.paginate)(items, total, Number(page), Number(limit)) };
    }
    async findOne(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: { items: true, user: true },
        });
        return { data: order };
    }
    async updateStatus(id, status, trackingCode) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order)
            return;
        order.status = status;
        if (trackingCode)
            order.trackingCode = trackingCode;
        if (status === app_constants_1.OrderStatus.SHIPPED)
            order.shippedAt = new Date();
        if (status === app_constants_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
            order.paymentStatus = app_constants_1.PaymentStatus.PAID;
        }
        await this.orderRepo.save(order);
        if (order.userId) {
            const messages = {
                confirmed: { title: 'سفارش تأیید شد', body: `سفارش ${order.orderNumber} تأیید و در حال آماده‌سازی است` },
                shipped: { title: 'سفارش ارسال شد', body: `سفارش ${order.orderNumber} ارسال شد. کد رهگیری: ${trackingCode ?? '—'}` },
                delivered: { title: 'سفارش تحویل داده شد', body: `سفارش ${order.orderNumber} با موفقیت تحویل داده شد` },
                cancelled: { title: 'سفارش لغو شد', body: `سفارش ${order.orderNumber} لغو شد` },
            };
            if (messages[status]) {
                await this.notificationsService.create(order.userId, {
                    ...messages[status],
                    type: `order_${status}`,
                    link: `/account/orders/${order.orderNumber}`,
                });
            }
        }
        return { data: order };
    }
};
exports.AdminOrdersController = AdminOrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('from')),
    __param(5, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('trackingCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminOrdersController.prototype, "updateStatus", null);
exports.AdminOrdersController = AdminOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Admin — Orders'),
    (0, common_1.Controller)('admin/orders'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(app_constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], AdminOrdersController);
//# sourceMappingURL=admin-orders.controller.js.map