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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("./entities/cart.entity");
const cart_item_entity_1 = require("./entities/cart-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const coupons_service_1 = require("../coupons/coupons.service");
const SHIPPING_THRESHOLD = 30_000_000;
const SHIPPING_COST = 500_000;
let CartService = class CartService {
    cartRepo;
    cartItemRepo;
    productRepo;
    variantRepo;
    couponsService;
    constructor(cartRepo, cartItemRepo, productRepo, variantRepo, couponsService) {
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
        this.variantRepo = variantRepo;
        this.couponsService = couponsService;
    }
    async getOrCreate(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('شناسه کاربر یا نشست الزامی است');
        }
        const where = userId ? { userId } : { sessionId };
        let cart = await this.cartRepo.findOne({
            where,
            relations: { items: { product: { images: true }, variant: true } },
        });
        if (!cart) {
            cart = this.cartRepo.create(userId ? { userId } : { sessionId });
            cart = await this.cartRepo.save(cart);
            cart.items = [];
        }
        return cart;
    }
    async getCartSummary(userId, sessionId) {
        const cart = await this.getOrCreate(userId, sessionId);
        return this.buildSummary(cart);
    }
    async addItem(dto, userId, sessionId) {
        const cart = await this.getOrCreate(userId, sessionId);
        const product = await this.productRepo.findOne({ where: { id: dto.productId, status: 'active' } });
        if (!product)
            throw new common_1.NotFoundException('محصول یافت نشد');
        const availableStock = dto.variantId
            ? (await this.variantRepo.findOne({ where: { id: dto.variantId } }))?.stock ?? 0
            : product.stock;
        if (availableStock < dto.quantity) {
            throw new common_1.BadRequestException(`تنها ${availableStock} عدد از این محصول موجود است`);
        }
        const existingItem = cart.items?.find((item) => item.productId === dto.productId && item.variantId === (dto.variantId ?? null));
        const unitPrice = dto.variantId
            ? product.price + ((await this.variantRepo.findOne({ where: { id: dto.variantId } }))?.priceModifier ?? 0)
            : product.price;
        if (existingItem) {
            const newQty = existingItem.quantity + dto.quantity;
            if (newQty > availableStock) {
                throw new common_1.BadRequestException(`حداکثر ${availableStock} عدد میتوانید سفارش دهید`);
            }
            existingItem.quantity = newQty;
            await this.cartItemRepo.save(existingItem);
        }
        else {
            const item = this.cartItemRepo.create({
                cartId: cart.id,
                productId: dto.productId,
                variantId: dto.variantId ?? null,
                quantity: dto.quantity,
                priceAtTime: unitPrice,
            });
            await this.cartItemRepo.save(item);
        }
        return this.getCartSummary(userId, sessionId);
    }
    async updateItem(itemId, quantity, userId, sessionId) {
        const cart = await this.getOrCreate(userId, sessionId);
        const item = cart.items?.find((i) => i.id === itemId);
        if (!item)
            throw new common_1.NotFoundException('آیتم در سبد خرید یافت نشد');
        if (quantity <= 0) {
            return this.removeItem(itemId, userId, sessionId);
        }
        const product = await this.productRepo.findOne({ where: { id: item.productId } });
        const stock = item.variantId
            ? (await this.variantRepo.findOne({ where: { id: item.variantId } }))?.stock ?? 0
            : (product?.stock ?? 0);
        if (quantity > stock) {
            throw new common_1.BadRequestException(`تنها ${stock} عدد موجود است`);
        }
        item.quantity = quantity;
        await this.cartItemRepo.save(item);
        return this.getCartSummary(userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        await this.cartItemRepo.delete(itemId);
        return this.getCartSummary(userId, sessionId);
    }
    async clearCart(cartId) {
        await this.cartItemRepo.delete({ cartId });
    }
    async applyCoupon(code, userId, sessionId) {
        const cart = await this.getOrCreate(userId, sessionId);
        const summary = await this.buildSummary(cart);
        const { coupon, discountAmount } = await this.couponsService.validate(code, summary.subtotal);
        return {
            ...summary,
            coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
            discountAmount,
            total: summary.subtotal - discountAmount + summary.shippingCost,
        };
    }
    async mergeGuestCart(sessionId, userId) {
        const guestCart = await this.cartRepo.findOne({
            where: { sessionId },
            relations: { items: true },
        });
        if (!guestCart || !guestCart.items?.length)
            return;
        const userCart = await this.getOrCreate(userId);
        for (const guestItem of guestCart.items) {
            try {
                await this.addItem({ productId: guestItem.productId, variantId: guestItem.variantId ?? undefined, quantity: guestItem.quantity }, userId);
            }
            catch {
            }
        }
        await this.clearCart(guestCart.id);
        await this.cartRepo.delete(guestCart.id);
    }
    async buildSummary(cart) {
        const items = cart.items ?? [];
        const subtotal = items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);
        const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const freeShippingRemaining = subtotal < SHIPPING_THRESHOLD
            ? SHIPPING_THRESHOLD - subtotal
            : 0;
        return {
            cartId: cart.id,
            items: items.map((item) => ({
                id: item.id,
                product: item.product ? {
                    id: item.product.id,
                    name: item.product.name,
                    slug: item.product.slug,
                    sku: item.product.sku,
                    stock: item.product.stock,
                    image: item.product.images?.find((img) => img.isPrimary)?.url ?? item.product.images?.[0]?.url ?? null,
                } : null,
                variant: item.variant ? { id: item.variant.id, name: item.variant.name } : null,
                quantity: item.quantity,
                priceAtTime: item.priceAtTime,
                totalPrice: item.priceAtTime * item.quantity,
            })),
            subtotal,
            shippingCost,
            freeShippingRemaining,
            total: subtotal + shippingCost,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        coupons_service_1.CouponsService])
], CartService);
//# sourceMappingURL=cart.service.js.map