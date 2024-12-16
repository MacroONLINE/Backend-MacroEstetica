// src/users/users.controller.ts

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
  UploadedFile,
  UseInterceptors,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly cloudinaryService: CloudinaryService) {}
  

  @ApiOperation({ summary: 'Check if a user exists by email' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get('check-email')
  async checkUserByEmail(@Query('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.checkUserExistsByEmail(email);
  }

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

    const newUser = await this.usersService.createUser(userCreateInput);

    return {
      message: 'User created successfully',
      userId: newUser.id,
    };
  }

  @ApiOperation({ summary: 'Complete user profile (Step 2)' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Put('complete-profile')
  async completeProfile(@Body() userData: UpdateUserDto) {
    try {
      if (!userData.id) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const { id, role, ...updateData } = userData;

      // Actualizar el perfil básico del usuario sin manejar datos específicos de roles
      await this.usersService.updateUser(id, updateData);

      // Los datos específicos de roles se manejan en endpoints separados
      // Puedes agregar aquí una validación para recordar al usuario que complete la información específica de su rol si es necesario

      return { message: 'User profile updated successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Profile update failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoint para MEDICO
  @ApiOperation({ summary: 'Crear o actualizar un Medico con carga de archivo' })
@UseInterceptors(FileInterceptor('file'))
@Put('medico')
async updateMedico(
  @UploadedFile() file: Express.Multer.File,
  @Body() data: UpdateMedicoDto,
) {
  if (!data.userId) {
    throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
  }

  if (file) {
    try {
      // Subir el archivo a Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      // Guardar la URL en el campo verification
      data.verification = uploadResult.secure_url;
    } catch (error) {
      throw new HttpException(
        'Error al subir el archivo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  return this.usersService.createOrUpdateMedico(data.userId, data);
}

  @ApiOperation({ summary: 'Get Medico information' })
  @ApiResponse({ status: 200, description: 'Medico found.' })
  @ApiResponse({ status: 404, description: 'Medico not found.' })
  @Get('medico')
  async getMedico(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getMedicoByUserId(userId);
  }

  // Endpoint para EMPRESA
  @ApiOperation({ summary: 'Create or update an Empresa' })
  @ApiResponse({ status: 200, description: 'Empresa updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: UpdateEmpresaDto })
  @Put('empresa')
  async updateEmpresa(@Body() data: UpdateEmpresaDto) {
    if (!data.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    if (!data.name) {
      throw new HttpException('El campo "name" es obligatorio', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.createOrUpdateEmpresa(data.userId, data);
  }

  @ApiOperation({ summary: 'Get Empresa information' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Empresa found.' })
  @ApiResponse({ status: 404, description: 'Empresa not found.' })
  @Get('empresa')
  async getEmpresa(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getEmpresaByUserId(userId);
  }

  // Endpoint para INSTRUCTOR
  @ApiOperation({ summary: 'Create or update an Instructor' })
  @ApiResponse({ status: 200, description: 'Instructor updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: UpdateInstructorDto })
  @Put('instructor')
  async updateInstructor(@Body() data: UpdateInstructorDto) {
    if (!data.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.createOrUpdateInstructor(data.userId, data);
  }

  @ApiOperation({ summary: 'Get Instructor information' })
  @ApiResponse({ status: 200, description: 'Instructor found.' })
  @ApiResponse({ status: 404, description: 'Instructor not found.' })
  @Get('instructor')
  async getInstructor(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getInstructorByUserId(userId);
  }

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
