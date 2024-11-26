import { Controller, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from 'src/users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }
}
