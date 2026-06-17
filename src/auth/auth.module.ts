import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuditService, JwtStrategy],
  imports: [
    PrismaModule,
    AuditModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
})
export class AuthModule {}
