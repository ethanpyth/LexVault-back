import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService,
  ) {}

  async login(dto: LoginDto, req: any, ip: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        ipAddress: ip ?? '',
        userAgent: req.headers['user-agent'],
        expiresAt: expiresAt,
        token: '',
      },
    });

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      sessionId: session.id,
    };

    const access_token = await this.jwtService.signAsync(payload);

    await this.prisma.session.update({
      where: {
        id: payload.sessionId,
      },
      data: {
        token: access_token,
      },
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    await this.audit.log({
      userId: user.id,
      action: 'LOGIN',
      entite: 'AUTH',
      ip: ip,
    });

    return {
      access_token,
    };
  }

  async logout(userId: string, sessionId: string) {
    await this.prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    await this.audit.log({
      userId: userId,
      action: 'LOGOUT',
      entite: 'AUTH',
    });

    return { success: true };
  }

  profile(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        personne: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
      },
    });
  }
}
