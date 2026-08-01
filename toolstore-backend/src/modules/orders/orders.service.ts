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

    // محاسبه کوپن با دریافت userId برای کنترل سقف perUserLimit
    let discountAmount = 0;
    let couponCode: string | null = null;
    let appliedCoupon: any = null;

    if (dto.couponCode) {
      const { coupon, discountAmount: discount } = await this.couponsService.validate(
        dto.couponCode, cartSummary.subtotal, userId,
      );
      const shippingCostBeforeCoupon = cartSummary.subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      discountAmount = coupon.type === CouponType.FREE_SHIPPING
        ? shippingCostBeforeCoupon
        : discount;
      couponCode = coupon.code;
      appliedCoupon = coupon;
    }

    const shippingCost = cartSummary.subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const finalShipping = appliedCoupon?.type === CouponType.FREE_SHIPPING ? 0 : shippingCost;
    const total = cartSummary.subtotal - discountAmount + finalShipping;

    // ─── Transaction: بررسی موجودی با لاک FOR UPDATE + ایجاد سفارش + کاهش موجودی ────
    return this.dataSource.transaction(async (manager) => {
      const lockedProducts = new Map<string, Product>();

      // بررسی موجودی و وضعیت فعال بودن تمامی آیتم‌ها با قفل بدبینانه (pessimistic_write)
      for (const item of cartSummary.items) {
        if (!item.product) continue;
        const product = await manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || (product as any).status !== 'active') {
          throw new BadRequestException(`محصول "${item.product.name}" دیگر در دسترس نیست`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `موجودی محصول "${item.product.name}" کافی نیست (موجودی فعلی: ${product.stock})`,
          );
        }

        lockedProducts.set(product.id, product);
      }

      // تولید شماره سفارش منحصربه‌فرد
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
        subtotal: cartSummary.subtotal,
        discountAmount,
        shippingCost: finalShipping,
        total,
        couponCode,
        notes: dto.notes,
      });

      const savedOrder = await manager.save(order);

      // ساخت آیتم‌های سفارش + کاهش موجودی و افزایش تعداد فروش
      for (const item of cartSummary.items) {
        if (!item.product) continue;
        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.product.id,
          variantId: item.variant?.id ?? null,
          productName: item.product.name,
          variantName: item.variant?.name ?? null,
          unitPrice: item.priceAtTime,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        });
        await manager.save(orderItem);

        // کاهش موجودی و افزایش فروش از روی کامپوننت لاک‌شده
        const product = lockedProducts.get(item.product.id)!;
        product.stock -= item.quantity;
        product.soldCount += item.quantity;
        await manager.save(product);
      }

      // افزایش تعداد استفاده از کد تخفیف
      if (appliedCoupon) {
        await this.couponsService.incrementUsage(appliedCoupon.id);
      }

      // پاک کردن سبد خرید کاربر
      await this.cartService.clearCart(cartSummary.cartId);

      // ارسال اعلان به کاربر
      await this.notificationsService.create(userId, {
        title: 'سفارش جدید ثبت شد',
        body: `سفارش شما با شماره ${orderNumber} ثبت شد و در حال پردازش است.`,
        type: 'order_created' as any,
        link: `/account/orders/${orderNumber}`,
      });

      return savedOrder;
    });
  }

  // ─── لیست سفارش‌های کاربر ─────────────────────────────────────────
  async getUserOrders(userId: string, page = 1, limit = 10) {
    const [items, total] = await this.orderRepo.findAndCount({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginate(items, total, page, limit);
  }

  async findUserOrders(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── جزئیات یک سفارش ─────────────────────────────────────────────
  async getOrderDetail(userId: string, orderNumber: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { orderNumber, userId },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('سفارش یافت نشد');
    return order;
  }

  async findByOrderNumber(orderNumber: string, userId: string): Promise<Order> {
    return this.getOrderDetail(userId, orderNumber);
  }

  // ─── لغو سفارش توسط کاربر ─────────────────────────────────────────
  async cancelOrder(orderNumber: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { orderNumber, userId },
      relations: { items: true },
    });

    if (!order) throw new NotFoundException('سفارش یافت نشد');

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('تنها سفارش‌های در انتظار پردازش قابل لغو هستند');
    }

    order.status = OrderStatus.CANCELLED;
    const savedOrder = await this.orderRepo.save(order);

    // بازگرداندن موجودی محصولات
    for (const item of order.items) {
      if (item.productId) {
        await this.productRepo.increment({ id: item.productId }, 'stock', item.quantity);
        await this.productRepo.decrement({ id: item.productId }, 'soldCount', item.quantity);
      }
    }

    return savedOrder;
  }

  // ─── Private Helpers ─────────────────────────────────────────────

  private async generateOrderNumber(manager: any): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const prefix = `ORD-${year}${month}${day}-`;

    const lastOrder = await manager.findOne(Order, {
      where: {},
      order: { createdAt: 'DESC' },
      lock: { mode: 'pessimistic_write' },
    });

    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber.startsWith(prefix)) {
      const lastSeq = parseInt(lastOrder.orderNumber.replace(prefix, ''), 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }

    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  }
}
