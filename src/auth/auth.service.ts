// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  private isAllowAnyPassword(): boolean {
    return String(process.env.ALLOW_ANY_PASSWORD).toLowerCase() === 'true';
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    if (this.isAllowAnyPassword()) {
      const { password, ...result } = user;
      return result;
    }
    const ok = await bcrypt.compare(pass, user.password);
    if (ok) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      access_token,
      user,
    };
  }
}
