import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const { password, email, role } = userData;
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    if (role === 'MEDICO' && !userData.verificacion) {
      throw new HttpException('Verificacion is required for MEDICO role', HttpStatus.BAD_REQUEST);
    }
    if (role === 'EMPRESA' && !userData.dni) {
      throw new HttpException('DNI is required for EMPRESA role', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert the class instance to a plain object
    const dataObject = Object.assign({}, userData);

    // Exclude 'verificacion' and 'dni' from the top-level
    const { verificacion, dni, ...userDataForUser } = dataObject;

    const userCreateInput: Prisma.UserCreateInput = {
      ...userDataForUser,
      password: hashedPassword,
    };

    // Add related models conditionally
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

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const { email, password } = loginData;
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const { password: _, ...userWithoutPassword } = user;
    return { message: 'Login successful', user: userWithoutPassword };
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

  // New methods for Medico
  @UseGuards(JwtAuthGuard)
  @Get(':userId/medico')
  async getMedicoByUserId(@Param('userId') userId: string) {
    const medico = await this.usersService.getMedicoByUserId(userId);
    if (!medico) {
      throw new HttpException('Medico not found', HttpStatus.NOT_FOUND);
    }
    return medico;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId/medico')
  async updateMedico(
    @Param('userId') userId: string,
    @Body() data: UpdateMedicoDto,
  ) {
    try {
      const updatedMedico = await this.usersService.updateMedico(userId, data);
      return updatedMedico;
    } catch (error) {
      throw new HttpException('Medico update failed', HttpStatus.BAD_REQUEST);
    }
  }

  // New methods for Empresa
  @UseGuards(JwtAuthGuard)
  @Get(':userId/empresa')
  async getEmpresaByUserId(@Param('userId') userId: string) {
    const empresa = await this.usersService.getEmpresaByUserId(userId);
    if (!empresa) {
      throw new HttpException('Empresa not found', HttpStatus.NOT_FOUND);
    }
    return empresa;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId/empresa')
  async updateEmpresa(
    @Param('userId') userId: string,
    @Body() data: UpdateEmpresaDto,
  ) {
    try {
      const updatedEmpresa = await this.usersService.updateEmpresa(userId, data);
      return updatedEmpresa;
    } catch (error) {
      throw new HttpException('Empresa update failed', HttpStatus.BAD_REQUEST);
    }
  }
}
