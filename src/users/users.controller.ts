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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const { password, email, role, newsletter } = userData;
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
    const userCreateInput: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
      newsletter: newsletter ?? false, // Establece el valor de newsletter o false si no está definido
    };

    if (role === 'MEDICO') {
      userCreateInput.medico = { create: { verificacion: userData.verificacion! } };
    }
    if (role === 'EMPRESA') {
      userCreateInput.empresa = { create: { dni: userData.dni! } };
    }

    const user = await this.usersService.createUser(userCreateInput);
    const { password: _, ...userWithoutPassword } = user;
    return { message: 'User created successfully', user: userWithoutPassword };
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Medico by user ID' })
  @ApiResponse({ status: 200, description: 'Medico found' })
  @ApiResponse({ status: 404, description: 'Medico not found' })
  @Get(':userId/medico')
  async getMedicoByUserId(@Param('userId') userId: string) {
    const medico = await this.usersService.getMedicoByUserId(userId);
    if (!medico) {
      throw new HttpException('Medico not found', HttpStatus.NOT_FOUND);
    }
    return medico;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Medico information' })
  @ApiResponse({ status: 200, description: 'Medico updated successfully' })
  @ApiResponse({ status: 400, description: 'Medico update failed' })
  @Put(':userId/medico')
  async updateMedico(@Param('userId') userId: string, @Body() data: UpdateMedicoDto) {
    try {
      const updatedMedico = await this.usersService.updateMedico(userId, data);
      return updatedMedico;
    } catch (error) {
      throw new HttpException('Medico update failed', HttpStatus.BAD_REQUEST);
    }
  }

  // Empresa-specific endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Empresa by user ID' })
  @ApiResponse({ status: 200, description: 'Empresa found' })
  @ApiResponse({ status: 404, description: 'Empresa not found' })
  @Get(':userId/empresa')
  async getEmpresaByUserId(@Param('userId') userId: string) {
    const empresa = await this.usersService.getEmpresaByUserId(userId);
    if (!empresa) {
      throw new HttpException('Empresa not found', HttpStatus.NOT_FOUND);
    }
    return empresa;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update Empresa information' })
  @ApiResponse({ status: 200, description: 'Empresa updated successfully' })
  @ApiResponse({ status: 400, description: 'Empresa update failed' })
  @Put(':userId/empresa')
  async updateEmpresa(@Param('userId') userId: string, @Body() data: UpdateEmpresaDto) {
    try {
      const updatedEmpresa = await this.usersService.updateEmpresa(userId, data);
      return updatedEmpresa;
    } catch (error) {
      throw new HttpException('Empresa update failed', HttpStatus.BAD_REQUEST);
    }
  }
}
