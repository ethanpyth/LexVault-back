import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PersonsModule } from './persons/persons.module';
import { FolderModule } from './folder/folder.module';
import { TribunalsModule } from './tribunals/tribunals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    PersonsModule,
    FolderModule,
    TribunalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
