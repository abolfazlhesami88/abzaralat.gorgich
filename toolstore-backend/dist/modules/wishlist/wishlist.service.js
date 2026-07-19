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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const product_entity_1 = require("../products/entities/product.entity");
let WishlistService = class WishlistService {
    wishlistRepo;
    productRepo;
    constructor(wishlistRepo, productRepo) {
        this.wishlistRepo = wishlistRepo;
        this.productRepo = productRepo;
    }
    async findAll(userId) {
        const items = await this.wishlistRepo.find({
            where: { userId },
            relations: { product: { images: true, brand: true, category: true } },
            order: { createdAt: 'DESC' },
        });
        return items.map((item) => ({
            id: item.id,
            addedAt: item.createdAt,
            product: item.product,
        }));
    }
    async toggle(userId, productId) {
        const existing = await this.wishlistRepo.findOne({
            where: { userId, productId },
        });
        if (existing) {
            await this.wishlistRepo.remove(existing);
            return { isWishlisted: false };
        }
        const product = await this.productRepo.findOne({ where: { id: productId, status: 'active' } });
        if (!product)
            throw new common_1.ConflictException('محصول یافت نشد');
        await this.wishlistRepo.save(this.wishlistRepo.create({ userId, productId }));
        return { isWishlisted: true };
    }
    async check(userId, productId) {
        const exists = await this.wishlistRepo.findOne({ where: { userId, productId } });
        return { isWishlisted: !!exists };
    }
    async getProductIds(userId) {
        const items = await this.wishlistRepo.find({
            where: { userId },
            select: { productId: true },
        });
        return items.map((i) => i.productId);
    }
    async remove(userId, productId) {
        await this.wishlistRepo.delete({ userId, productId });
        return { isWishlisted: false };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map