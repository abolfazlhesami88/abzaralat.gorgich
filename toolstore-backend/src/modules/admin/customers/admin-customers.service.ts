import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { UserRole, OrderStatus } from '../../../common/constants/app.constants';
import { paginate } from '../../../common/dto/pagination.dto';

@Injectable()
export class AdminCustomersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const safeLimit = Math.min(Number(limit) || 20, 500);

    const qb = this.userRepo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CUSTOMER })
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      qb.andWhere(
        '(user.email ILIKE :s OR user.firstName ILIKE :s OR user.lastName ILIKE :s OR user.phone ILIKE :s)',
        { s: `%${search}%` },
      );
    }

    const [items, total] = await qb
      .skip((page - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    // اضافه کردن تعداد سفارشات برای هر کاربر
    const enriched = await Promise.all(
      items.map(async (user) => {
        const [orderCount, totalSpent] = await Promise.all([
          this.orderRepo.count({ where: { userId: user.id } }),
          this.orderRepo
            .createQueryBuilder('o')
            .select('COALESCE(SUM(o.total), 0)', 'sum')
            .where('o.userId = :uid', { uid: user.id })
            .andWhere('o.paymentStatus = :ps', { ps: 'paid' })
            .andWhere('o.status != :cancelledStatus', { cancelledStatus: OrderStatus.CANCELLED })
            .getRawOne()
            .then((r) => Number(r?.sum ?? 0)),
        ]);

        return { ...user, orderCount, totalSpent };
      }),
    );

    return paginate(enriched, total, page, safeLimit);
  }

  async getDetail(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const orders = await this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return { user, orders };
  }

  async toggleActive(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;
    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }
}
