import { Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../auth/interfaces/auth-user.interface';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  getNotifications(@CurrentUser() user: JwtPayload) {
    return this.service.getNotifications(user);
  }

  @Patch(':id')
  markAsRead(id: string) {
    return this.service.markAsRead(id);
  }
}
