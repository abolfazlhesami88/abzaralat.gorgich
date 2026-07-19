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
exports.AdminCustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
const app_constants_1 = require("../../../common/constants/app.constants");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
let AdminCustomersService = class AdminCustomersService {
    userRepo;
    orderRepo;
    constructor(userRepo, orderRepo) {
        this.userRepo = userRepo;
        this.orderRepo = orderRepo;
    }
    async findAll(page = 1, limit = 20, search) {
        const qb = this.userRepo
            .createQueryBuilder('user')
            .where('user.role = :role', { role: app_constants_1.UserRole.CUSTOMER })
            .orderBy('user.createdAt', 'DESC');
        if (search) {
            qb.andWhere('(user.email ILIKE :s OR user.firstName ILIKE :s OR user.lastName ILIKE :s OR user.phone ILIKE :s)', { s: `%${search}%` });
        }
        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        const enriched = await Promise.all(items.map(async (user) => {
            const [orderCount, totalSpent] = await Promise.all([
                this.orderRepo.count({ where: { userId: user.id } }),
                this.orderRepo
                    .createQueryBuilder('o')
                    .select('COALESCE(SUM(o.total), 0)', 'sum')
                    .where('o.userId = :uid', { uid: user.id })
                    .andWhere('o.paymentStatus = :ps', { ps: 'paid' })
                    .getRawOne()
                    .then((r) => Number(r?.sum ?? 0)),
            ]);
            return { ...user, orderCount, totalSpent };
        }));
        return (0, pagination_dto_1.paginate)(enriched, total, page, limit);
    }
    async getDetail(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const orders = await this.orderRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        return { user, orders };
    }
    async toggleActive(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            return;
        user.isActive = !user.isActive;
        return this.userRepo.save(user);
    }
};
exports.AdminCustomersService = AdminCustomersService;
exports.AdminCustomersService = AdminCustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminCustomersService);
//# sourceMappingURL=admin-customers.service.js.map