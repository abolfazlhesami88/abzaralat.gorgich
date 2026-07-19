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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const address_entity_1 = require("../addresses/entities/address.entity");
const product_entity_1 = require("../products/entities/product.entity");
const cart_service_1 = require("../cart/cart.service");
const coupons_service_1 = require("../coupons/coupons.service");
const notifications_service_1 = require("../notifications/notifications.service");
const app_constants_1 = require("../../common/constants/app.constants");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const SHIPPING_THRESHOLD = 30_000_000;
const SHIPPING_COST = 500_000;
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    addressRepo;
    productRepo;
    cartService;
    couponsService;
    notificationsService;
    dataSource;
    constructor(orderRepo, orderItemRepo, addressRepo, productRepo, cartService, couponsService, notificationsService, dataSource) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.addressRepo = addressRepo;
        this.productRepo = productRepo;
        this.cartService = cartService;
        this.couponsService = couponsService;
        this.notificationsService = notificationsService;
        this.dataSource = dataSource;
    }
    async checkout(userId, dto) {
        const cartSummary = await this.cartService.getCartSummary(userId);
        if (!cartSummary.items.length) {
            throw new common_1.BadRequestException('سبد خرید شما خالی است');
        }
        const address = await this.addressRepo.findOne({
            where: { id: dto.addressId, userId },
        });
        if (!address)
            throw new common_1.NotFoundException('آدرس یافت نشد');
        let discountAmount = 0;
        let couponCode = null;
        let appliedCoupon = null;
        if (dto.couponCode) {
            const { coupon, discountAmount: discount } = await this.couponsService.validate(dto.couponCode, cartSummary.subtotal);
            discountAmount = coupon.type === app_constants_1.CouponType.FREE_SHIPPING
                ? SHIPPING_COST
                : discount;
            couponCode = coupon.code;
            appliedCoupon = coupon;
        }
        const shippingCost = cartSummary.subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const finalShipping = appliedCoupon?.type === app_constants_1.CouponType.FREE_SHIPPING ? 0 : shippingCost;
        const total = cartSummary.subtotal - discountAmount + finalShipping;
        return this.dataSource.transaction(async (manager) => {
            for (const item of cartSummary.items) {
                const product = await manager.findOne(product_entity_1.Product, { where: { id: item.product.id } });
                if (!product || product.stock < item.quantity) {
                    throw new common_1.BadRequestException(`موجودی محصول "${item.product.name}" کافی نیست`);
                }
            }
            const orderNumber = await this.generateOrderNumber(manager);
            const order = manager.create(order_entity_1.Order, {
                orderNumber,
                userId,
                shippingAddress: {
                    fullName: address.fullName,
                    phone: address.phone,
                    province: address.province,
                    city: address.city,
                    addressLine: address.addressLine,
                    postalCode: address.postalCode,
                },
                status: app_constants_1.OrderStatus.PENDING,
                paymentStatus: app_constants_1.PaymentStatus.UNPAID,
                paymentMethod: dto.paymentMethod,
                subtotal: cartSummary.subtotal,
                discountAmount,
                shippingCost: finalShipping,
                taxAmount: 0,
                total,
                couponCode,
                notes: dto.notes ?? undefined,
            });
            const savedOrder = await manager.save(order);
            for (const item of cartSummary.items) {
                await manager.save(order_item_entity_1.OrderItem, {
                    orderId: savedOrder.id,
                    productId: item.product.id,
                    productName: item.product.name,
                    productSku: item.product.sku,
                    productImage: item.product.image,
                    variantName: item.variant?.name ?? null,
                    quantity: item.quantity,
                    unitPrice: item.priceAtTime,
                    totalPrice: item.priceAtTime * item.quantity,
                });
                await manager.decrement(product_entity_1.Product, { id: item.product.id }, 'stock', item.quantity);
                await manager.increment(product_entity_1.Product, { id: item.product.id }, 'soldCount', item.quantity);
            }
            if (appliedCoupon) {
                await this.couponsService.incrementUsage(appliedCoupon.id);
            }
            await this.cartService.clearCart(cartSummary.cartId);
            return savedOrder;
        });
    }
    async findUserOrders(userId, page = 1, limit = 10) {
        const [items, total] = await this.orderRepo.findAndCount({
            where: { userId },
            relations: { items: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findByOrderNumber(orderNumber, userId) {
        const order = await this.orderRepo.findOne({
            where: { orderNumber, userId },
            relations: { items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('سفارش یافت نشد');
        return order;
    }
    async cancelOrder(orderNumber, userId) {
        const order = await this.findByOrderNumber(orderNumber, userId);
        if (![app_constants_1.OrderStatus.PENDING, app_constants_1.OrderStatus.CONFIRMED].includes(order.status)) {
            throw new common_1.BadRequestException('این سفارش قابل لغو نیست');
        }
        order.status = app_constants_1.OrderStatus.CANCELLED;
        for (const item of order.items) {
            if (item.productId) {
                await this.productRepo.increment({ id: item.productId }, 'stock', item.quantity);
                await this.productRepo.decrement({ id: item.productId }, 'soldCount', item.quantity);
            }
        }
        const savedOrder = await this.orderRepo.save(order);
        await this.notificationsService.create(order.userId, {
            title: 'سفارش شما لغو شد',
            body: `سفارش ${order.orderNumber} با موفقیت لغو شد`,
            type: 'order_cancelled',
            link: `/account/orders/${order.orderNumber}`,
        });
        return savedOrder;
    }
    async generateOrderNumber(manager) {
        const last = await manager.findOne(order_entity_1.Order, {
            order: { createdAt: 'DESC' },
        });
        const lastNumber = last?.orderNumber
            ? parseInt(last.orderNumber.split('-')[1]) + 1
            : 1001;
        return `TS-${lastNumber}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cart_service_1.CartService,
        coupons_service_1.CouponsService,
        notifications_service_1.NotificationsService,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map