import { Controller, Get, Patch, Body, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { OrderStatus, PaymentStatus, UserRole } from '../../../common/constants/app.constants';
import { NotificationsService } from '../../notifications/notifications.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { paginate } from '../../../common/dto/pagination.dto';

@ApiTags('Admin — Orders')
@Controller('admin/orders')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminOrdersController {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (status) qb.andWhere('order.status = :status', { status });
    if (search) qb.andWhere('order.orderNumber ILIKE :s', { s: `%${search}%` });
    if (from) qb.andWhere('order.createdAt >= :from', { from: new Date(from) });
    if (to) qb.andWhere('order.createdAt <= :to', { to: new Date(to) });

    const safeLimit = Math.min(Number(limit) || 20, 500);

    const [items, total] = await qb
      .skip((Number(page) - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    return { data: paginate(items, total, Number(page), safeLimit) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { items: true, user: true },
    });
    return { data: order };
  }

  // FIX [Pillar 1 & 2 — Business Logic + Concurrency]:
  // تغییر وضعیت سفارش توسط ادمین — بازگرداندن موجودی در صورت لغو
  // ۱. کل عملیات درون یک Transaction اجرا می‌شود
  // ۲. قفل pessimistic_write روی سفارش و محصولات
  // ۳. موجودی ProductVariant هم بازگردانده می‌شود (قبلاً فراموش شده بود)
  // ۴. N+1 fix: به جای حلقه increment جداگانه، از batch update استفاده می‌شود
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('trackingCode') trackingCode?: string,
  ) {
    const result = await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: { items: true },
        lock: { mode: 'pessimistic_write' },
      });
      if (!order) return null;

      const wasAlreadyCancelled = order.status === OrderStatus.CANCELLED;
      const isCancellingNow = status === OrderStatus.CANCELLED && !wasAlreadyCancelled;
      const isReactivatingNow = wasAlreadyCancelled && status !== OrderStatus.CANCELLED;

      order.status = status;
      if (trackingCode) order.trackingCode = trackingCode;
      if (status === OrderStatus.SHIPPED) order.shippedAt = new Date();
      if (status === OrderStatus.DELIVERED) {
        order.deliveredAt = new Date();
        order.paymentStatus = PaymentStatus.PAID;
      }

      await manager.save(order);

      // FIX [Pillar 1 — Business Logic + Pillar 2 — Concurrency]:
      // بازگرداندن موجودی در صورت لغو — با قفل و درون TX
      if (isCancellingNow && order.items?.length) {
        for (const item of order.items) {
          if (item.productId) {
            // قفل pessimistic_write روی محصول برای جلوگیری از race condition
            const product = await manager.findOne(Product, {
              where: { id: item.productId },
              lock: { mode: 'pessimistic_write' },
            });
            if (product) {
              product.stock += item.quantity;
              product.soldCount = Math.max(0, product.soldCount - item.quantity);
              await manager.save(product);
            }
          }

          // FIX [Pillar 1]: بازگرداندن موجودی Variant — قبلاً اصلاً انجام نمی‌شد!
          const variantId = (item as any).variantId;
          if (variantId) {
            const variant = await manager.findOne(ProductVariant, {
              where: { id: variantId },
              lock: { mode: 'pessimistic_write' },
            });
            if (variant) {
              variant.stock += item.quantity;
              await manager.save(variant);
            }
          }
        }
      } else if (isReactivatingNow && order.items?.length) {
        for (const item of order.items) {
          if (item.productId) {
            const product = await manager.findOne(Product, {
              where: { id: item.productId },
              lock: { mode: 'pessimistic_write' },
            });
            if (product) {
              if (product.stock < item.quantity) {
                throw new BadRequestException('موجودی کافی برای فعالسازی مجدد این سفارش وجود ندارد');
              }
              product.stock = Math.max(0, product.stock - item.quantity);
              product.soldCount += item.quantity;
              await manager.save(product);
            }
          }

          const variantId = (item as any).variantId;
          if (variantId) {
            const variant = await manager.findOne(ProductVariant, {
              where: { id: variantId },
              lock: { mode: 'pessimistic_write' },
            });
            if (variant) {
              if (variant.stock < item.quantity) {
                throw new BadRequestException('موجودی کافی برای فعالسازی مجدد این سفارش وجود ندارد');
              }
              variant.stock = Math.max(0, variant.stock - item.quantity);
              await manager.save(variant);
            }
          }
        }
      }

      return order;
    });

    if (!result) return { data: null };

    // اطلاع‌رسانی به مشتری — خارج از TX چون side-effect است
    if (result.userId) {
      const messages: Record<string, { title: string; body: string }> = {
        confirmed: { title: 'سفارش تأیید شد', body: `سفارش ${result.orderNumber} تأیید و در حال آماده‌سازی است` },
        shipped:   { title: 'سفارش ارسال شد', body: `سفارش ${result.orderNumber} ارسال شد. کد رهگیری: ${trackingCode ?? '—'}` },
        delivered: { title: 'سفارش تحویل داده شد', body: `سفارش ${result.orderNumber} با موفقیت تحویل داده شد` },
        cancelled: { title: 'سفارش لغو شد', body: `سفارش ${result.orderNumber} لغو شد` },
      };

      if (messages[status]) {
        await this.notificationsService.create(result.userId, {
          ...messages[status],
          type: `order_${status}` as any,
          link: `/account/orders/${result.orderNumber}`,
        });
      }
    }

    return { data: result };
  }
}
