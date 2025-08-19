import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NextAuthStrategy extends PassportStrategy(Strategy, 'nextauth') {
  private readonly logger = new Logger('NextAuthStrategy');

  constructor(config: ConfigService) {
    const secret = config.get<string>('NEXTAUTH_SECRET') || config.get<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
    if (!secret) {
      this.logger.error('NEXTAUTH_SECRET missing and no JWT_SECRET fallback');
    }
  }

  async validate(payload: any) {
    const userId = payload?.sub || payload?.userId || payload?.id || null;
    const email = payload?.email || payload?.username || null;
    this.logger.log(`validate sub=${userId || ''} email=${email || ''}`);
    if (!email) return null;
    return { userId, email };
  }
}
