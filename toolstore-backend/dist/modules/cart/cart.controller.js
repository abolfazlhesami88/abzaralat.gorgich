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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const optional_jwt_guard_1 = require("../../common/guards/optional-jwt.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getIds(user, req) {
        return {
            userId: user?.sub ?? undefined,
            sessionId: !user?.sub ? req.headers['x-session-id'] : undefined,
        };
    }
    async getCart(user, req) {
        const { userId, sessionId } = this.getIds(user, req);
        return { data: await this.cartService.getCartSummary(userId, sessionId) };
    }
    async addItem(dto, user, req) {
        const { userId, sessionId } = this.getIds(user, req);
        return { data: await this.cartService.addItem(dto, userId, sessionId) };
    }
    async updateItem(id, quantity, user, req) {
        const { userId, sessionId } = this.getIds(user, req);
        return { data: await this.cartService.updateItem(id, quantity, userId, sessionId) };
    }
    async removeItem(id, user, req) {
        const { userId, sessionId } = this.getIds(user, req);
        return { data: await this.cartService.removeItem(id, userId, sessionId) };
    }
    async applyCoupon(dto, user, req) {
        const { userId, sessionId } = this.getIds(user, req);
        return { data: await this.cartService.applyCoupon(dto.couponCode, userId, sessionId) };
    }
    async mergeGuest(sessionId, user) {
        if (!user?.sub)
            return { data: null };
        await this.cartService.mergeGuestCart(sessionId, user.sub);
        return { data: await this.cartService.getCartSummary(user.sub) };
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'دریافت سبد خرید' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'افزودن محصول به سبد' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_to_cart_dto_1.AddToCartDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'تغییر تعداد آیتم' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('quantity')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'حذف آیتم از سبد' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)('apply-coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'اعمال کد تخفیف' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_to_cart_dto_1.ApplyCouponDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Post)('merge-guest'),
    (0, swagger_1.ApiOperation)({ summary: 'همگامسازی سبد Guest بعد از لاگین' }),
    __param(0, (0, common_1.Body)('sessionId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "mergeGuest", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtGuard),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map