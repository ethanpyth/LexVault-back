import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../interfaces/auth-user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    console.log(payload);
    const session = await this.prisma.session.findFirst({
      where: {
        token: payload.token,
        id: payload.sessionId,
      },
    });

    console.log(session);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    if (!session.isActive) {
      throw new UnauthorizedException('Inactive session');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}
