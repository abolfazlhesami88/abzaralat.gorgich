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
exports.AdminCouponsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const coupon_entity_1 = require("../../coupons/entities/coupon.entity");
const typeorm_2 = require("typeorm");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const app_constants_1 = require("../../../common/constants/app.constants");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
let AdminCouponsController = class AdminCouponsController {
    couponRepo;
    constructor(couponRepo) {
        this.couponRepo = couponRepo;
    }
    async findAll(page = 1, limit = 20) {
        const [items, total] = await this.couponRepo.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        return { data: (0, pagination_dto_1.paginate)(items, total, Number(page), Number(limit)) };
    }
    async create(dto) {
        if (dto.code)
            dto.code = dto.code.toUpperCase();
        return { data: await this.couponRepo.save(this.couponRepo.create(dto)) };
    }
    async update(id, dto) {
        await this.couponRepo.update(id, dto);
        return { data: await this.couponRepo.findOne({ where: { id } }) };
    }
    async remove(id) {
        await this.couponRepo.delete(id);
        return { data: null };
    }
};
exports.AdminCouponsController = AdminCouponsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "remove", null);
exports.AdminCouponsController = AdminCouponsController = __decorate([
    (0, swagger_1.ApiTags)('Admin — Coupons'),
    (0, common_1.Controller)('admin/coupons'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(app_constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminCouponsController);
//# sourceMappingURL=admin-coupons.controller.js.map