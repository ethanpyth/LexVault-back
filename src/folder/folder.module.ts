import { Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { PrismaModule } from '../prisma/prisma.module';
import { InfractionsModule } from './infractions/infractions.module';
import { AudiencesModule } from './audiences/audiences.module';
import { DecisionsModule } from './decisions/decisions.module';
import { SentencesModule } from './sentences/sentences.module';
import { TribunalsModule } from '../tribunals/tribunals.module';

@Module({
  imports: [
    PrismaModule,
    InfractionsModule,
    AudiencesModule,
    DecisionsModule,
    SentencesModule,
    TribunalsModule,
  ],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
