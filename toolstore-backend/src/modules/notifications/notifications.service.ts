import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async findAll(userId: string) {
    const [items, total] = await this.notifRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const unreadCount = items.filter((n) => !n.isRead).length;
    return { items, unreadCount, total };
  }

  async markAllRead(userId: string) {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
  }

  async markRead(notifId: string, userId: string) {
    await this.notifRepo.update({ id: notifId, userId }, { isRead: true });
  }

  async create(userId: string, payload: {
    title: string;
    body: string;
    type: NotificationType | string;
    link?: string;
  }) {
    const notif = this.notifRepo.create({ userId, ...payload } as any);
    return this.notifRepo.save(notif);
  }
}
