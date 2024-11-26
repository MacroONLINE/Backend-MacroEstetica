import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {  UseGuards, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() userData: Prisma.UserCreateInput) {
    const { password, email } = userData;
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({ ...userData, password: hashedPassword });
    return { message: 'User created successfully', user };
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const { email, password } = loginData;
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Login successful', user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
@Get(':id')
async getUserById(@Param('id') id: string) {
  const user = await this.usersService.findUserById(id);
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  return user;
}

}
