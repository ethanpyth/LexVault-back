import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('00***')
  async clearExpiredSessions() {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
