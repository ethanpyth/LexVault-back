import { Module } from '@nestjs/common';
import { TribunalsService } from './tribunals.service';
import { TribunalsController } from './tribunals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TribunalsService],
  controllers: [TribunalsController],
  exports: [TribunalsService],
})
export class TribunalsModule {}
