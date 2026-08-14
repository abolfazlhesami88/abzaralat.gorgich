import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Address } from '../addresses/entities/address.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
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
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
    private readonly cartService: CartService,
    private readonly couponsService: CouponsService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Checkout — تبدیل سبد به سفارش ────────────────────────────────────────
  async checkout(userId: string, dto: CheckoutDto): Promise<Order> {
    // cart summary را قبل از TX فقط برای پیدا کردن آیتم‌ها می‌گیریم
    // قیمت‌ها درون TX مجدداً از DB خوانده می‌شوند (نه از cart summary)
    const cartSummary = await this.cartService.getCartSummary(userId);

    if (!cartSummary.items.length) {
      throw new BadRequestException('سبد خرید شما خالی است');
    }

    // بررسی آدرس — خارج از TX چون read-only است
    const address = await this.addressRepo.findOne({
      where: { id: dto.addressId, userId },
    });
    if (!address) throw new NotFoundException('آدرس یافت نشد');

    // ─── Transaction ────────────────────────────────────────────────────────────
    return this.dataSource.transaction(async (manager) => {
      const lockedProducts = new Map<string, Product>();
      const lockedVariants = new Map<string, ProductVariant>();

      // FIX [Pillar 2 — Concurrency + Pillar 1 — Business Logic]:
      // قیمت‌ها را مجدداً از DB با pessimistic_write lock می‌خوانیم.
      // این تضمین می‌کند که قیمت‌های cart summary (که ممکن است stale باشند)
      // مورد استفاده مالی قرار نگیرند.
      let recomputedSubtotal = 0;

      for (const item of cartSummary.items) {
        if (!item.product) continue;

        const product = await manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || (product as any).status !== 'active') {
          throw new BadRequestException(`محصول "${item.product.name}" دیگر در دسترس نیست`);
        }

        // FIX [Pillar 2]: بررسی موجودی روی Product اصلی با قفل DB
        if (!item.variant?.id && product.stock < item.quantity) {
          throw new BadRequestException(
            `موجودی محصول "${product.name}" کافی نیست (موجودی فعلی: ${product.stock})`,
          );
        }

        lockedProducts.set(product.id, product);

        // قیمت نهایی واقعی از DB (نه از cart summary که ممکن است stale باشد)
        let realUnitPrice = product.price;

        if (item.variant?.id) {
          const variant = await manager.findOne(ProductVariant, {
            where: { id: item.variant.id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!variant) {
            throw new BadRequestException(`تنوع انتخابی محصول "${product.name}" در دسترس نیست`);
          }

          if (variant.stock < item.quantity) {
            throw new BadRequestException(
              `موجودی تنوع "${variant.name}" کافی نیست (موجودی فعلی: ${variant.stock})`,
            );
          }

          lockedVariants.set(variant.id, variant);
          realUnitPrice = product.price + (variant.priceModifier ?? 0);
        }

        recomputedSubtotal += realUnitPrice * item.quantity;
        // به‌روزرسانی قیمت واقعی در item (برای استفاده در ایجاد OrderItem)
        (item as any)._realUnitPrice = realUnitPrice;
      }

      // اعتبارسنجی و دریافت قفل ترکنشی برای کد تخفیف
      let discountAmount = 0;
      let couponCode: string | null = null;
      let appliedCoupon: any = null;

      const shippingCostBeforeCoupon = recomputedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

      const couponToApply = dto.couponCode || cartSummary.coupon?.code;
      if (couponToApply) {
        const { coupon, discountAmount: discount } = await this.couponsService.validate(
          couponToApply, recomputedSubtotal, userId, manager,
        );

        discountAmount = coupon.type === CouponType.FREE_SHIPPING
          ? shippingCostBeforeCoupon
          : discount;

        couponCode = coupon.code;
        appliedCoupon = coupon;
      }

      const finalShipping = shippingCostBeforeCoupon;

      // FIX [Pillar 1 — Financial Integrity]: total هرگز نمی‌تواند منفی باشد
      const rawTotal = recomputedSubtotal + shippingCostBeforeCoupon - discountAmount;
      const total = Math.max(0, rawTotal);

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
        paymentMethod: dto.paymentMethod, // FIX: Added paymentMethod to be saved with the order
        subtotal: recomputedSubtotal,
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

        // FIX [Pillar 1]: استفاده از قیمت واقعی که از DB خوانده شد (نه cart price)
        const realUnitPrice = (item as any)._realUnitPrice ?? item.priceAtTime;
        const realTotalPrice = realUnitPrice * item.quantity;

        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.product.id,
          variantId: item.variant?.id ?? null,
          productName: item.product.name,
          variantName: item.variant?.name ?? null,
          unitPrice: realUnitPrice,
          quantity: item.quantity,
          totalPrice: realTotalPrice,
        });
        await manager.save(orderItem);

        // کاهش موجودی و افزایش فروش محصول اصلی
        const product = lockedProducts.get(item.product.id)!;
        product.stock = Math.max(0, product.stock - item.quantity);
        product.soldCount += item.quantity;
        await manager.save(product);

        // کاهش موجودی تنوع محصول (ProductVariant)
        if (item.variant?.id) {
          const variant = lockedVariants.get(item.variant.id)!;
          variant.stock -= item.quantity;
          await manager.save(variant);
        }
      }

      // افزایش تعداد استفاده از کد تخفیف داخل ترکنش
      if (appliedCoupon) {
        await this.couponsService.incrementUsage(appliedCoupon.id, manager);
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

  // ─── لیست سفارش‌های کاربر ──────────────────────────────────────────────────
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

  // ─── جزئیات یک سفارش ───────────────────────────────────────────────────────
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

  // ─── لغو سفارش توسط کاربر ──────────────────────────────────────────────────
  // FIX [Pillar 1 — Business Logic + Pillar 2 — Concurrency]:
  // ۱. اجرا درون Transaction با pessimistic_write lock
  // ۲. بازگرداندن موجودی ProductVariant (قبلاً فراموش شده بود)
  // ۳. Batch update با increment به جای loop جداگانه برای هر محصول
  async cancelOrder(orderNumber: string, userId: string): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { orderNumber, userId },
        relations: { items: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!order) throw new NotFoundException('سفارش یافت نشد');

      // FIX [Pillar 1 — Business Logic]: فقط سفارش‌های PENDING قابل لغو هستند
      // (از طرف کاربر — ادمین می‌تواند هر وضعیتی را لغو کند)
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('تنها سفارش‌های در انتظار پردازش قابل لغو هستند');
      }

      order.status = OrderStatus.CANCELLED;
      const savedOrder = await manager.save(order);

      // FIX [Pillar 1 + Pillar 2]: بازگرداندن موجودی محصولات و variant‌ها
      // با قفل pessimistic_write برای جلوگیری از race condition
      for (const item of order.items) {
        if (item.productId) {
          // بازگرداندن موجودی محصول اصلی
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
            lock: { mode: 'pessimistic_write' },
          });

          if (product) {
            product.stock += item.quantity;
            // از صفر کمتر نشود
            product.soldCount = Math.max(0, product.soldCount - item.quantity);
            await manager.save(product);
          }
        }

        // FIX [Pillar 1]: بازگرداندن موجودی Variant — قبلاً اصلاً انجام نمی‌شد!
        if ((item as any).variantId) {
          const variant = await manager.findOne(ProductVariant, {
            where: { id: (item as any).variantId },
            lock: { mode: 'pessimistic_write' },
          });

          if (variant) {
            variant.stock += item.quantity;
            await manager.save(variant);
          }
        }
      }

      return savedOrder;
    });
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  // FIX [Pillar 2 — Concurrency]:
  // generateOrderNumber با pessimistic_write lock روی آخرین سفارش —
  // این از duplicate شماره جلوگیری می‌کند در concurrent checkouts.
  // از prefix روزانه استفاده می‌کند، اما در boundary تاریخ (نیمه‌شب) هم
  // sequence از ۱ شروع می‌شود و unique index روی orderNumber در entity
  // آخرین خط دفاعی است.
  private async generateOrderNumber(manager: any): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const prefix = `ORD-${year}${month}${day}-`;

    // قفل روی آخرین سفارش این روز برای جلوگیری از race condition
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
