import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InfractionsModule } from './infractions/infractions.module';
import { AudiencesModule } from './audiences/audiences.module';
import { DecisionsModule } from './decisions/decisions.module';
import { SentencesModule } from './sentences/sentences.module';
import { TribunalsModule } from '../tribunals/tribunals.module';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    PrismaModule,
    InfractionsModule,
    AudiencesModule,
    DecisionsModule,
    SentencesModule,
    TribunalsModule,
    AuditModule,
    NotificationsModule,
  ],
  controllers: [FolderController],
  providers: [FolderService, AuditService, PrismaService, NotificationsService],
})
export class FolderModule {}
