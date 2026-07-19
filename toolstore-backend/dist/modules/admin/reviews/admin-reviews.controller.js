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
exports.AdminReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const review_entity_1 = require("../../reviews/entities/review.entity");
const typeorm_2 = require("typeorm");
const reviews_service_1 = require("../../reviews/reviews.service");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const app_constants_1 = require("../../../common/constants/app.constants");
const pagination_dto_1 = require("../../../common/dto/pagination.dto");
let AdminReviewsController = class AdminReviewsController {
    reviewRepo;
    reviewsService;
    constructor(reviewRepo, reviewsService) {
        this.reviewRepo = reviewRepo;
        this.reviewsService = reviewsService;
    }
    async findAll(page = 1, limit = 20, approved) {
        const qb = this.reviewRepo
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.user', 'user')
            .leftJoinAndSelect('review.product', 'product')
            .orderBy('review.createdAt', 'DESC');
        if (approved !== undefined) {
            qb.andWhere('review.isApproved = :approved', { approved: approved === 'true' });
        }
        const [items, total] = await qb
            .skip((Number(page) - 1) * Number(limit))
            .take(Number(limit))
            .getManyAndCount();
        return { data: (0, pagination_dto_1.paginate)(items, total, Number(page), Number(limit)) };
    }
    async approve(id) {
        await this.reviewRepo.update(id, { isApproved: true });
        const review = await this.reviewRepo.findOne({ where: { id } });
        if (review?.productId) {
            await this.reviewsService.recalculateProductRating(review.productId);
        }
        return { data: null, message: 'نظر تأیید شد' };
    }
    async reject(id) {
        await this.reviewRepo.update(id, { isApproved: false });
        const review = await this.reviewRepo.findOne({ where: { id } });
        if (review?.productId) {
            await this.reviewsService.recalculateProductRating(review.productId);
        }
        return { data: null, message: 'نظر رد شد' };
    }
    async remove(id) {
        const review = await this.reviewRepo.findOne({ where: { id } });
        await this.reviewRepo.delete(id);
        if (review?.productId) {
            await this.reviewsService.recalculateProductRating(review.productId);
        }
        return { data: null };
    }
};
exports.AdminReviewsController = AdminReviewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('approved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "remove", null);
exports.AdminReviewsController = AdminReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Admin — Reviews'),
    (0, common_1.Controller)('admin/reviews'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(app_constants_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        reviews_service_1.ReviewsService])
], AdminReviewsController);
//# sourceMappingURL=admin-reviews.controller.js.map