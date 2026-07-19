import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
export declare class NotificationsService {
    private readonly notifRepo;
    constructor(notifRepo: Repository<Notification>);
    findAll(userId: string): Promise<{
        items: Notification[];
        unreadCount: number;
        total: number;
    }>;
    markAllRead(userId: string): Promise<void>;
    markRead(notifId: string, userId: string): Promise<void>;
    create(userId: string, payload: {
        title: string;
        body: string;
        type: NotificationType | string;
        link?: string;
    }): Promise<Notification[]>;
}
