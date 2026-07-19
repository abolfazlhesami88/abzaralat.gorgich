import { Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    return { data: await this.notificationsService.findAll(userId) };
  }

  @Patch('read-all')
  async markAllRead(@CurrentUser('sub') userId: string) {
    await this.notificationsService.markAllRead(userId);
    return { data: null, message: 'همه پیامها خوانده شدند' };
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    await this.notificationsService.markRead(id, userId);
    return { data: null };
  }
}
