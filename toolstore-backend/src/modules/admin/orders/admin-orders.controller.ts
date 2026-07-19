import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
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
    private readonly notificationsService: NotificationsService,
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

    const [items, total] = await qb
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();

    return { data: paginate(items, total, Number(page), Number(limit)) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { items: true, user: true },
    });
    return { data: order };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('trackingCode') trackingCode?: string,
  ) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) return;

    order.status = status;
    if (trackingCode) order.trackingCode = trackingCode;
    if (status === OrderStatus.SHIPPED) order.shippedAt = new Date();
    if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
      order.paymentStatus = PaymentStatus.PAID;
    }

    await this.orderRepo.save(order);

    // اطلاعرسانی به مشتری
    if (order.userId) {
      const messages: Record<string, { title: string; body: string }> = {
        confirmed: { title: 'سفارش تأیید شد', body: `سفارش ${order.orderNumber} تأیید و در حال آماده‌سازی است` },
        shipped: { title: 'سفارش ارسال شد', body: `سفارش ${order.orderNumber} ارسال شد. کد رهگیری: ${trackingCode ?? '—'}` },
        delivered: { title: 'سفارش تحویل داده شد', body: `سفارش ${order.orderNumber} با موفقیت تحویل داده شد` },
        cancelled: { title: 'سفارش لغو شد', body: `سفارش ${order.orderNumber} لغو شد` },
      };

      if (messages[status]) {
        await this.notificationsService.create(order.userId, {
          ...messages[status],
          type: `order_${status}` as any,
          link: `/account/orders/${order.orderNumber}`,
        });
      }
    }

    return { data: order };
  }
}
