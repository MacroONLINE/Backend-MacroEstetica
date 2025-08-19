// src/auth/nextauth.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NextAuthStrategy extends PassportStrategy(Strategy, 'nextauth') {
  constructor(config: ConfigService) {
    const secret = config.get<string>('NEXTAUTH_SECRET') || config.get<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }
  async validate(payload: any) {
    const userId = payload.sub || payload.userId || payload.id || null;
    const email = payload.email || payload.username || null;
    if (!email) return null;
    return { userId, email };
  }
}
