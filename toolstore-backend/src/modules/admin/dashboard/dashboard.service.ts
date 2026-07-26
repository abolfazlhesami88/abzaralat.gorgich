import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { OrderStatus, PaymentStatus, UserRole } from '../../../common/constants/app.constants';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      todayRevenue,
      totalCustomers,
      newCustomersToday,
      lowStockCount,
      pendingOrders,
      totalProducts,
      activeProducts,
    ] = await Promise.all([
      this.orderRepo.count({
        where: { createdAt: today as any },
      }),
      this.orderRepo
        .createQueryBuilder('o')
        .select('COALESCE(SUM(o.total), 0)', 'sum')
        .where('o.createdAt >= :today', { today })
        .andWhere('o.paymentStatus = :status', { status: PaymentStatus.PAID })
        .getRawOne()
        .then((r) => Number(r?.sum ?? 0)),
      this.userRepo.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepo.count({
        where: { role: UserRole.CUSTOMER, createdAt: today as any },
      }),
      this.productRepo
        .createQueryBuilder('p')
        .where('p.status = :status', { status: 'active' })
        .andWhere('p.stock <= p.lowStockThreshold')
        .andWhere('p.stock > 0')
        .getCount(),
      this.orderRepo.count({ where: { status: OrderStatus.PENDING } }),
      this.productRepo.count(),
      this.productRepo.count({ where: { status: 'active' as any } }),
    ]);

    return {
      todayOrders,
      todayRevenue,
      totalCustomers,
      newCustomersToday,
      lowStockCount,
      pendingOrders,
      totalProducts,
      activeProducts,
    };
  }

  // Revenue chart — داده برای نمودار خطی
  async getRevenueChart(period: '7d' | '30d' | '90d' = '30d') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const from = new Date();
    from.setDate(from.getDate() - days);

    const rows = await this.dataSource.query(`
      SELECT
        DATE(created_at) as date,
        COALESCE(SUM(total), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE created_at >= $1
        AND payment_status = 'paid'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [from]);

    // پر کردن روزهای بدون داده با صفر
    const result: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const found = rows.find((r: any) => r.date === dateStr);
      result.push({
        date: dateStr,
        revenue: Number(found?.revenue ?? 0),
        orders: Number(found?.orders ?? 0),
      });
    }

    return result;
  }

  // Top products
  async getTopProducts(limit = 5) {
    return this.productRepo.find({
      where: { status: 'active' as any },
      order: { soldCount: 'DESC' },
      take: limit,
      select: { id: true, name: true, sku: true, soldCount: true, price: true },
    });
  }

  // Low stock alerts
  async getLowStockAlerts() {
    return this.productRepo.find({
      where: { status: 'active' as any },
      relations: { category: true },
      order: { stock: 'ASC' },
    }).then((products) =>
      products.filter((p) => p.stock <= p.lowStockThreshold && p.stock >= 0),
    );
  }

  // Recent orders
  async getRecentOrders(limit = 8) {
    return this.orderRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      select: { id: true, orderNumber: true, status: true, total: true, createdAt: true, userId: true },
    });
  }
}
