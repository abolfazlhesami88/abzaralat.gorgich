import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(userId: string): Promise<{
        data: {
            items: import("./entities/notification.entity").Notification[];
            unreadCount: number;
            total: number;
        };
    }>;
    markAllRead(userId: string): Promise<{
        data: null;
        message: string;
    }>;
    markRead(id: string, userId: string): Promise<{
        data: null;
    }>;
}
