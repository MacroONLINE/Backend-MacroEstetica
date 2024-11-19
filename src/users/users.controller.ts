import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Step 1: Register with email and password
  @ApiOperation({ summary: 'Register a new user (Step 1)' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const { password, email, role } = userData;
    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCreateInput = {
      email,
      password: hashedPassword,
      role: role || 'ESTANDAR',
    };

    const user = await this.usersService.createUser(userCreateInput);
    const { password: _, ...userWithoutPassword } = user;
    return { message: 'User created successfully' };
  }

  // Step 2: Complete user profile
  @ApiOperation({ summary: 'Complete user profile (Step 2)' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  // Paso 2: Completar el perfil del usuario
@Put('complete-profile')
@ApiOperation({ summary: 'Complete user profile (Step 2)' })
@ApiResponse({ status: 200, description: 'User profile updated successfully.' })
@ApiResponse({ status: 400, description: 'Bad request.' })
async completeProfile(@Body() userData: UpdateUserDto) {
  try {
    if (!userData.id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const { id, role, verification, dni, bio, ...updateData } = userData;

    // Verificar datos específicos del rol
    if (role === 'MEDICO' && !verification) {
      throw new HttpException(
        'Verification is required for MEDICO role',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (role === 'EMPRESA' && !dni) {
      throw new HttpException(
        'DNI is required for EMPRESA role',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (role === 'INSTRUCTOR' && !bio) {
      throw new HttpException(
        'Bio is required for INSTRUCTOR role',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Actualizar usuario
    const user = await this.usersService.updateUser(id, updateData);

    // Manejar relaciones específicas del rol
    if (role === 'MEDICO') {
      await this.usersService.createOrUpdateMedico(id, { verification });
    } else if (role === 'EMPRESA') {
      await this.usersService.createOrUpdateEmpresa(id, { dni });
    } else if (role === 'INSTRUCTOR') {
      await this.usersService.createOrUpdateInstructor(id, { bio });
    }

    const { password, ...userWithoutPassword } = user;
    return { message: 'User profile updated successfully', user: userWithoutPassword };
  } catch (error) {
    throw new HttpException(
      error.message || 'Profile update failed',
      error.status || HttpStatus.BAD_REQUEST,
    );
  }
}


  // Get current user profile
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update Medico information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Medico information' })
  @ApiResponse({ status: 200, description: 'Medico updated successfully' })
  @ApiResponse({ status: 400, description: 'Medico update failed' })
  @Put('medico')
  async updateMedico(@Request() req, @Body() data: UpdateMedicoDto) {
    const userId = req.user.id;
    return this.usersService.updateMedico(userId, data);
  }

  // Get Medico information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Medico information' })
  @ApiResponse({ status: 200, description: 'Medico found' })
  @ApiResponse({ status: 404, description: 'Medico not found' })
  @Get('medico')
  async getMedico(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getMedicoByUserId(userId);
  }

  // Update Empresa information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Empresa information' })
  @ApiResponse({ status: 200, description: 'Empresa updated successfully' })
  @ApiResponse({ status: 400, description: 'Empresa update failed' })
  @Put('empresa')
  async updateEmpresa(@Request() req, @Body() data: UpdateEmpresaDto) {
    const userId = req.user.id;
    return this.usersService.updateEmpresa(userId, data);
  }

  // Get Empresa information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Empresa information' })
  @ApiResponse({ status: 200, description: 'Empresa found' })
  @ApiResponse({ status: 404, description: 'Empresa not found' })
  @Get('empresa')
  async getEmpresa(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getEmpresaByUserId(userId);
  }

  // Update Instructor information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Instructor information' })
  @ApiResponse({ status: 200, description: 'Instructor updated successfully.' })
  @ApiResponse({ status: 400, description: 'Instructor update failed.' })
  @Put('instructor')
  async updateInstructor(@Request() req, @Body() data: UpdateInstructorDto) {
    const userId = req.user.id;
    return this.usersService.createOrUpdateInstructor(userId, data);
  }

  // Get Instructor information
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Instructor information' })
  @ApiResponse({ status: 200, description: 'Instructor found.' })
  @ApiResponse({ status: 404, description: 'Instructor not found.' })
  @Get('instructor')
  async getInstructor(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getInstructorByUserId(userId);
  }

  // Obtener un usuario por su ID
@ApiOperation({ summary: 'Get user by ID' })
@ApiResponse({ status: 200, description: 'User found.' })
@ApiResponse({ status: 404, description: 'User not found.' })
@Get(':id')
async findUserById(@Param('id') id: string) {
  const user = await this.usersService.findUserById(id);
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
}

