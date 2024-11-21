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
} from '@nestjs/swagger';
import * as Multer from 'multer';
import { Prisma } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async completeProfile(
    @Body() userData: UpdateUserDto,
    @Body() empresaData?: UpdateEmpresaDto,
  ) {
    try {
      if (!userData.id) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const { id, role, verification, ...updateData } = userData;

      await this.usersService.updateUser(id, updateData, {
        medicoData: role === 'MEDICO' ? { verification } : undefined,
        empresaData: role === 'EMPRESA' ? empresaData : undefined,
        instructorData: role === 'INSTRUCTOR' ? { profession: userData.bio as any } : undefined,
      });

      return { message: 'User profile updated successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Profile update failed',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Create or update a Medico with file upload' })
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
      // Simulate file storage and create a URL
      data.verification = `https://mockstorage.com/${file.filename}`;
    }
  
    return this.usersService.updateMedico(data.userId, data);
  }
  

  @ApiOperation({ summary: 'Get Medico information' })

  @ApiResponse({ status: 200, description: 'Medico found.' })
  @ApiResponse({ status: 404, description: 'Medico not found.' })
  @Get('medico')
  async getMedico(@Request() req) {
    const userId = req.user.id;
    return this.usersService.getMedicoByUserId(userId);
  }

  @ApiOperation({ summary: 'Update Empresa information' })

  @ApiOperation({ summary: 'Create or update an Empresa' })
  @Put('empresa')
  async updateEmpresa(@Body() data: UpdateEmpresaDto & { userId: string }) {
    if (!data.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateEmpresa(data.userId, data);
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

  @ApiOperation({ summary: 'Update Instructor information' })

  @ApiOperation({ summary: 'Create or update an Instructor' })
  @Put('instructor')
  async updateInstructor(@Body() data: UpdateInstructorDto & { userId: string }) {
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
