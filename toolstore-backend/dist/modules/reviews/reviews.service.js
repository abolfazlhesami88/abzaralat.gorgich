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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./entities/review.entity");
const product_entity_1 = require("../products/entities/product.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const app_constants_1 = require("../../common/constants/app.constants");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ReviewsService = class ReviewsService {
    reviewRepo;
    productRepo;
    orderRepo;
    constructor(reviewRepo, productRepo, orderRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
    }
    async findByProductSlug(slug, page = 1, limit = 10) {
        const product = await this.productRepo.findOne({ where: { slug } });
        if (!product)
            throw new common_1.NotFoundException('محصول یافت نشد');
        const [items, total] = await this.reviewRepo.findAndCount({
            where: { productId: product.id, isApproved: true },
            relations: { user: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const sanitized = items.map((review) => ({
            id: review.id,
            rating: review.rating,
            title: review.title,
            body: review.body,
            isVerifiedPurchase: review.isVerifiedPurchase,
            helpfulCount: review.helpfulCount,
            createdAt: review.createdAt,
            userName: review.user
                ? `${review.user.firstName ?? ''} ${review.user.lastName?.[0] ?? ''}`.trim() || 'کاربر ToolStore'
                : 'کاربر حذفشده',
        }));
        return (0, pagination_dto_1.paginate)(sanitized, total, page, limit);
    }
    async getRatingSummary(productSlug) {
        const product = await this.productRepo.findOne({ where: { slug: productSlug } });
        if (!product)
            throw new common_1.NotFoundException('محصول یافت نشد');
        const rows = await this.reviewRepo
            .createQueryBuilder('review')
            .select('review.rating', 'rating')
            .addSelect('COUNT(*)', 'count')
            .where('review.productId = :id', { id: product.id })
            .andWhere('review.isApproved = true')
            .groupBy('review.rating')
            .getRawMany();
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        rows.forEach((r) => { distribution[r.rating] = parseInt(r.count); });
        return {
            averageRating: product.averageRating,
            totalReviews: product.reviewCount,
            distribution,
        };
    }
    async create(userId, dto) {
        const product = await this.productRepo.findOne({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('محصول یافت نشد');
        const existing = await this.reviewRepo.findOne({
            where: { productId: dto.productId, userId },
        });
        if (existing) {
            throw new common_1.ConflictException('شما قبلاً برای این محصول نظر ثبت کردهاید');
        }
        let isVerifiedPurchase = false;
        let orderId = null;
        if (dto.orderId) {
            const order = await this.orderRepo.findOne({
                where: { id: dto.orderId, userId, status: app_constants_1.OrderStatus.DELIVERED },
                relations: { items: true },
            });
            if (!order) {
                throw new common_1.ForbiddenException('سفارش معتبر برای ثبت نظر یافت نشد');
            }
            const hasProduct = order.items.some((item) => item.productId === dto.productId);
            if (!hasProduct) {
                throw new common_1.ForbiddenException('این محصول در سفارش انتخابی شما نیست');
            }
            isVerifiedPurchase = true;
            orderId = order.id;
        }
        const review = this.reviewRepo.create({
            productId: dto.productId,
            userId,
            orderId,
            rating: dto.rating,
            title: dto.title,
            body: dto.body,
            isVerifiedPurchase,
            isApproved: false,
        });
        return this.reviewRepo.save(review);
    }
    async markHelpful(reviewId) {
        const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('نظر یافت نشد');
        review.helpfulCount += 1;
        return this.reviewRepo.save(review);
    }
    async recalculateProductRating(productId) {
        const result = await this.reviewRepo
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'avg')
            .addSelect('COUNT(*)', 'count')
            .where('review.productId = :productId', { productId })
            .andWhere('review.isApproved = true')
            .getRawOne();
        await this.productRepo.update(productId, {
            averageRating: parseFloat(result.avg) || 0,
            reviewCount: parseInt(result.count) || 0,
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map