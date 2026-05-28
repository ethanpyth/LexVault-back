import { Module } from '@nestjs/common';
import { InfractionsController } from './infractions.controller';
import { InfractionsService } from './infractions.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InfractionsController],
  providers: [InfractionsService],
  exports: [InfractionsService],
})
export class InfractionsModule {}
