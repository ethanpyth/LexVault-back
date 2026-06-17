import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async notify(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId[0],
        message: dto.message,
        titre: dto.titre,
      },
    });
  }

  async getNotifications(user: JwtPayload) {
    return await this.prisma.notification.findMany({
      where: {
        userId: user.sub,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string) {
    return await this.prisma.notification.update({
      where: { id: id },
      data: {
        isRead: true,
      },
    });
  }

  // async notifyManyUsers(dto: CreateNotificationDto) {
  //   return this.prisma.notification.create({
  //     data: {
  //       userId: dto.userId[0],
  //       message: dto.message,
  //       titre: dto.titre,
  //     },
  //   });
}
