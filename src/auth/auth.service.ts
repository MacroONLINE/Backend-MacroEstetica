import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return { success: true };
  }

  async register(data: CreateUserDto) {
    const { email, password, role } = data;

    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (role === 'MEDICO' && !data.verificacion) {
      throw new HttpException('Verificacion is required for MEDICO role', HttpStatus.BAD_REQUEST);
    }
    if (role === 'EMPRESA' && !data.dni) {
      throw new HttpException('DNI is required for EMPRESA role', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const dataObject = Object.assign({}, data);

    const { verificacion, dni, ...userDataForUser } = dataObject;

    const userCreateInput: Prisma.UserCreateInput = {
      ...userDataForUser,
      password: hashedPassword,
    };
    if (role === 'MEDICO') {
      userCreateInput.medico = {
        create: {
          verificacion: verificacion!,
        },
      };
    }

    if (role === 'EMPRESA') {
      userCreateInput.empresa = {
        create: {
          dni: dni!,
        },
      };
    }

    const user = await this.usersService.createUser(userCreateInput);
    const { password: _, ...userWithoutPassword } = user;
    return { message: 'User created successfully', user: userWithoutPassword };
  }
}
