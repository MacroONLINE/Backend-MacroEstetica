import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    const ip = req.ip;
    const method = req.method;
    const url = req.originalUrl || req.url;
    this.logger.log(`incoming ${method} ${url} ip=${ip} auth=${auth ? auth.slice(0, 20) + '...' : 'none'}`);
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.substring(7);
      try {
        const dec: any = jwt.decode(token);
        const sub = dec?.sub || dec?.userId || '';
        const email = dec?.email || dec?.username || '';
        const exp = dec?.exp ? new Date(dec.exp * 1000).toISOString() : 'noexp';
        this.logger.log(`token sub=${sub} email=${email} exp=${exp}`);
      } catch (e: any) {
        this.logger.error(`decode error ${e?.message || e}`);
      }
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const url = req.originalUrl || req.url;
    if (err || !user) {
      const msg = typeof info === 'string' ? info : info?.message || '';
      this.logger.warn(`auth failed path=${url} err=${err?.message || ''} info=${msg}`);
    } else {
      const uid = user?.userId || user?.id || '';
      const uname = user?.username || user?.email || '';
      this.logger.log(`auth ok path=${url} userId=${uid} username=${uname}`);
    }
    return super.handleRequest(err, user, info, context);
  }
}
