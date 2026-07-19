import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Address } from '../addresses/entities/address.entity';
import { Product } from '../products/entities/product.entity';
import { CartService } from '../cart/cart.service';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderStatus, PaymentStatus, CouponType } from '../../common/constants/app.constants';
import { paginate } from '../../common/dto/pagination.dto';

const SHIPPING_THRESHOLD = 30_000_000;
const SHIPPING_COST = 500_000;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly cartService: CartService,
    private readonly couponsService: CouponsService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Checkout — تبدیل سبد به سفارش ───────────────────────────────
  async checkout(userId: string, dto: CheckoutDto): Promise<Order> {
    const cartSummary = await this.cartService.getCartSummary(userId);

    if (!cartSummary.items.length) {
      throw new BadRequestException('سبد خرید شما خالی است');
    }

    // بررسی آدرس
    const address = await this.addressRepo.findOne({
      where: { id: dto.addressId, userId },
    });
    if (!address) throw new NotFoundException('آدرس یافت نشد');

    // محاسبه کوپن
    let discountAmount = 0;
    let couponCode: string | null = null;
    let appliedCoupon: any = null;

    if (dto.couponCode) {
      const { coupon, discountAmount: discount } = await this.couponsService.validate(
        dto.couponCode, cartSummary.subtotal,
      );
      discountAmount = coupon.type === CouponType.FREE_SHIPPING
        ? SHIPPING_COST
        : discount;
      couponCode = coupon.code;
      appliedCoupon = coupon;
    }

    const shippingCost = cartSummary.subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const finalShipping = appliedCoupon?.type === CouponType.FREE_SHIPPING ? 0 : shippingCost;
    const total = cartSummary.subtotal - discountAmount + finalShipping;

    // ─── Transaction: بررسی موجودی + ایجاد سفارش + کاهش موجودی ────
    return this.dataSource.transaction(async (manager) => {
      // بررسی موجودی برای تمام آیتمها
      for (const item of cartSummary.items) {
        const product = await manager.findOne(Product, { where: { id: item.product!.id } });
        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            `موجودی محصول "${item.product!.name}" کافی نیست`,
          );
        }
      }

      // تولید شماره سفارش منحصربهفرد
      const orderNumber = await this.generateOrderNumber(manager);

      // ایجاد سفارش
      const order = manager.create(Order, {
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
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
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

      // ایجاد آیتمهای سفارش + کاهش موجودی
      for (const item of cartSummary.items) {
        await manager.save(OrderItem, {
          orderId: savedOrder.id,
          productId: item.product!.id,
          productName: item.product!.name,
          productSku: item.product!.sku,
          productImage: item.product!.image,
          variantName: item.variant?.name ?? null,
          quantity: item.quantity,
          unitPrice: item.priceAtTime,
          totalPrice: item.priceAtTime * item.quantity,
        });

        // کاهش موجودی
        await manager.decrement(Product, { id: item.product!.id }, 'stock', item.quantity);
        // افزایش تعداد فروش
        await manager.increment(Product, { id: item.product!.id }, 'soldCount', item.quantity);
      }

      // افزایش استفاده کوپن
      if (appliedCoupon) {
        await this.couponsService.incrementUsage(appliedCoupon.id);
      }

      // پاک کردن سبد خرید
      await this.cartService.clearCart(cartSummary.cartId);

      return savedOrder;
    });
  }

  // ─── لیست سفارشات کاربر ─────────────────────────────────────────
  async findUserOrders(userId: string, page = 1, limit = 10) {
    const [items, total] = await this.orderRepo.findAndCount({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginate(items, total, page, limit);
  }

  // ─── جزئیات سفارش ────────────────────────────────────────────────
  async findByOrderNumber(orderNumber: string, userId: string) {
    const order = await this.orderRepo.findOne({
      where: { orderNumber, userId },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('سفارش یافت نشد');
    return order;
  }

  async cancelOrder(orderNumber: string, userId: string) {
    const order = await this.findByOrderNumber(orderNumber, userId);

    // فقط سفارشهای pending یا confirmed قابل لغو هستند
    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw new BadRequestException('این سفارش قابل لغو نیست');
    }

    order.status = OrderStatus.CANCELLED;

    // بازگشت موجودی
    for (const item of order.items) {
      if (item.productId) {
        await this.productRepo.increment({ id: item.productId }, 'stock', item.quantity);
        await this.productRepo.decrement({ id: item.productId }, 'soldCount', item.quantity);
      }
    }

    const savedOrder = await this.orderRepo.save(order);

    await this.notificationsService.create(order.userId!, {
      title: 'سفارش شما لغو شد',
      body: `سفارش ${order.orderNumber} با موفقیت لغو شد`,
      type: 'order_cancelled',
      link: `/account/orders/${order.orderNumber}`,
    });

    return savedOrder;
  }

  // ─── Private Helpers ─────────────────────────────────────────────
  private async generateOrderNumber(manager: any): Promise<string> {
    const last = await manager.findOne(Order, {
      order: { createdAt: 'DESC' },
    });

    const lastNumber = last?.orderNumber
      ? parseInt(last.orderNumber.split('-')[1]) + 1
      : 1001;

    return `TS-${lastNumber}`;
  }
}
