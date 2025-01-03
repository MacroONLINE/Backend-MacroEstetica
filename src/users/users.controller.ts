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
  Req,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { CreateEmpresaDto } from './dto/update-empresa.dto';
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
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Check if a user exists by email' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get('check-email')
  async checkUserByEmail(@Query('email') email: string) {
    // Logs para depuración
    this.logger.debug(`checkUserByEmail => email: ${email}`);
    console.log('checkUserByEmail => email:', email);

    if (!email) {
      this.logger.error('Email is required');
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.usersService.checkUserExistsByEmail(email);
      this.logger.debug(`checkUserByEmail => Result: ${JSON.stringify(result)}`);
      console.log('checkUserByEmail => Result:', result);
      return result;
    } catch (err) {
      this.logger.error(`Error in checkUserByEmail => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Register a new user (Step 1)' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    // Logs para depuración
    this.logger.debug(`register => body: ${JSON.stringify(userData)}`);
    console.log('register => body:', userData);

    const { password, email, role } = userData;

    try {
      const existingUser = await this.usersService.findUserByEmail(email);
      if (existingUser) {
        this.logger.error('User already exists');
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const userCreateInput = {
        email,
        password: hashedPassword,
        role: role || 'ESTANDAR',
      };

      this.logger.debug(`register => userCreateInput: ${JSON.stringify(userCreateInput)}`);
      console.log('register => userCreateInput:', userCreateInput);

      const newUser = await this.usersService.createUser(userCreateInput);

      this.logger.debug(`register => newUser: ${JSON.stringify(newUser)}`);
      console.log('register => newUser:', newUser);

      return {
        message: 'User created successfully',
        userId: newUser.id,
      };
    } catch (err) {
      this.logger.error(`Error in register => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Complete user profile (Step 2)' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Put('complete-profile')
  async completeProfile(@Body() userData: UpdateUserDto) {
    // Logs para depuración
    this.logger.debug(`completeProfile => body: ${JSON.stringify(userData)}`);
    console.log('completeProfile => body:', userData);

    try {
      if (!userData.id) {
        this.logger.error('User ID is required in completeProfile');
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const { id, role, ...updateData } = userData;

      this.logger.debug(`completeProfile => updateData: ${JSON.stringify(updateData)}`);
      console.log('completeProfile => updateData:', updateData);

      await this.usersService.updateUser(id, updateData);

      return { message: 'User profile updated successfully' };
    } catch (error) {
      this.logger.error(`Error in completeProfile => ${error.message}`);
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
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateMedicoDto,
  ) {
    // Logs para depuración
    this.logger.debug(`updateMedico => Request headers: ${JSON.stringify(req.headers)}`);
    console.log('updateMedico => Request headers:', req.headers);
    
    this.logger.debug(`updateMedico => body: ${JSON.stringify(data)}`);
    console.log('updateMedico => body:', data);

    this.logger.debug(`updateMedico => file: ${JSON.stringify(file)}`);
    console.log('updateMedico => file:', file);

    if (!data.userId) {
      this.logger.error('User ID is required in updateMedico');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    if (file) {
      try {
        // Subir el archivo a Cloudinary
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        this.logger.debug(`updateMedico => uploadResult: ${JSON.stringify(uploadResult)}`);
        console.log('updateMedico => uploadResult:', uploadResult);

        // Guardar la URL en el campo verification
        data.verification = uploadResult.secure_url;
      } catch (error) {
        this.logger.error(`Error uploading file => ${error.message}`);
        throw new HttpException(
          'Error al subir el archivo',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      const result = await this.usersService.createOrUpdateMedico(data.userId, data);
      this.logger.debug(`updateMedico => result: ${JSON.stringify(result)}`);
      console.log('updateMedico => result:', result);

      return result;
    } catch (err) {
      this.logger.error(`Error in updateMedico => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get Medico information' })
  @ApiResponse({ status: 200, description: 'Medico found.' })
  @ApiResponse({ status: 404, description: 'Medico not found.' })
  @Get('medico')
  async getMedico(@Request() req) {
    const userId = req.user.id;
    this.logger.debug(`getMedico => userId: ${userId}`);
    console.log('getMedico => userId:', userId);

    try {
      const medico = await this.usersService.getMedicoByUserId(userId);
      this.logger.debug(`getMedico => result: ${JSON.stringify(medico)}`);
      console.log('getMedico => result:', medico);

      return medico;
    } catch (err) {
      this.logger.error(`Error in getMedico => ${err.message}`);
      throw err;
    }
  }

  // Endpoint para EMPRESA
  @ApiOperation({ summary: 'Create or update an Empresa' })
  @ApiResponse({ status: 200, description: 'Empresa updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateEmpresaDto })
  @Put('empresa')
  async updateEmpresa(@Body() data: CreateEmpresaDto) {
    // Logs para depuración
    this.logger.debug(`updateEmpresa => body: ${JSON.stringify(data)}`);
    console.log('updateEmpresa => body:', data);

    if (!data.userId) {
      this.logger.error('User ID is required in updateEmpresa');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!data.name) {
      this.logger.error('El campo "name" es obligatorio en updateEmpresa');
      throw new HttpException('El campo "name" es obligatorio', HttpStatus.BAD_REQUEST);
    }

    if (data.subscription && !['ORO', 'PLATA', 'BRONCE'].includes(data.subscription)) {
      this.logger.error('Invalid subscription type in updateEmpresa');
      throw new HttpException(
        'Subscription type must be ORO, PLATA, or BRONCE',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.usersService.createOrUpdateEmpresa(data.userId, data);
      this.logger.debug(`updateEmpresa => result: ${JSON.stringify(result)}`);
      console.log('updateEmpresa => result:', result);

      return result;
    } catch (err) {
      this.logger.error(`Error in updateEmpresa => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get Empresa information' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Empresa found.' })
  @ApiResponse({ status: 404, description: 'Empresa not found.' })
  @Get('empresa')
  async getEmpresa(@Request() req) {
    const userId = req.user.id;
    this.logger.debug(`getEmpresa => userId: ${userId}`);
    console.log('getEmpresa => userId:', userId);

    try {
      const empresa = await this.usersService.getEmpresaByUserId(userId);
      this.logger.debug(`getEmpresa => result: ${JSON.stringify(empresa)}`);
      console.log('getEmpresa => result:', empresa);

      return empresa;
    } catch (err) {
      this.logger.error(`Error in getEmpresa => ${err.message}`);
      throw err;
    }
  }

  // Endpoint para INSTRUCTOR
  @ApiOperation({ summary: 'Create or update an Instructor' })
  @ApiResponse({ status: 200, description: 'Instructor updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: UpdateInstructorDto })
  @Put('instructor')
  async updateInstructor(@Body() data: UpdateInstructorDto) {
    // Logs para depuración
    this.logger.debug(`updateInstructor => body: ${JSON.stringify(data)}`);
    console.log('updateInstructor => body:', data);

    if (!data.userId) {
      this.logger.error('User ID is required in updateInstructor');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.usersService.createOrUpdateInstructor(data.userId, data);
      this.logger.debug(`updateInstructor => result: ${JSON.stringify(result)}`);
      console.log('updateInstructor => result:', result);

      return result;
    } catch (err) {
      this.logger.error(`Error in updateInstructor => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get Instructor information' })
  @ApiResponse({ status: 200, description: 'Instructor found.' })
  @ApiResponse({ status: 404, description: 'Instructor not found.' })
  @Get('instructor')
  async getInstructor(@Request() req) {
    const userId = req.user.id;
    this.logger.debug(`getInstructor => userId: ${userId}`);
    console.log('getInstructor => userId:', userId);

    try {
      const instructor = await this.usersService.getInstructorByUserId(userId);
      this.logger.debug(`getInstructor => result: ${JSON.stringify(instructor)}`);
      console.log('getInstructor => result:', instructor);

      return instructor;
    } catch (err) {
      this.logger.error(`Error in getInstructor => ${err.message}`);
      throw err;
    }
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    // Logs para depuración
    this.logger.debug(`findUserById => id: ${id}`);
    console.log('findUserById => id:', id);

    try {
      const user = await this.usersService.findUserById(id);
      if (!user) {
        this.logger.error('User not found in findUserById');
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const { password, ...userWithoutPassword } = user;

      this.logger.debug(`findUserById => userWithoutPassword: ${JSON.stringify(userWithoutPassword)}`);
      console.log('findUserById => userWithoutPassword:', userWithoutPassword);

      return userWithoutPassword;
    } catch (err) {
      this.logger.error(`Error in findUserById => ${err.message}`);
      throw err;
    }
  }
}
