import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Query,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import * as bcrypt from 'bcrypt'

import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateMedicoDto } from './dto/update-medico.dto'
import { UpdateInstructorDto } from './dto/update-instructor.dto'
import { UpdateEmpresaDto } from './dto/update-empresa.dto'
import { UpdateProfileDto } from './dto/update-profile.dto/update-profile.dto'
import { ChangePasswordDto } from './dto/change-password.dto/change-password.dto'
import { ChangeEmailDto } from './dto/change-email.dto/change-email.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Check if a user exists by email' })
  @Get('check-email')
  async checkUserByEmail(@Query('email') email: string) {
    if (!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
    return this.usersService.checkUserExistsByEmail(email)
  }

  @ApiOperation({ summary: 'Register a new user (Step 1)' })
  @ApiResponse({ status: 201 })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const exists = await this.usersService.findUserByEmail(dto.email)
    if (exists) throw new HttpException('User already exists', HttpStatus.CONFLICT)
    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.usersService.createUser({ ...dto, password: hashed })
    return { message: 'User created successfully', userId: user.id }
  }

  @ApiOperation({ summary: 'Complete user profile (legacy Step 2)' })
  @Put('complete-profile')
  async completeProfile(@Body() dto: UpdateUserDto) {
    if (!dto.id) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    await this.usersService.updateUser(dto.id, dto)
    return { message: 'User profile updated successfully' }
  }

  @ApiOperation({ summary: 'Crear o actualizar un Medico' })
  @UseInterceptors(FileInterceptor('file'))
  @Put('medico')
  async updateMedico(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateMedicoDto,
  ) {
    if (!dto.userId)
      throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    if (file) dto.verification = (await this.usersService['cloudinary'].uploadImage(file)).secure_url
    return this.usersService.createOrUpdateMedico(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Crear o actualizar una Empresa' })
  @ApiBody({ type: UpdateEmpresaDto })
  @Put('empresa')
  async updateEmpresa(@Body() dto: UpdateEmpresaDto) {
    if (!dto.userId)
      throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateEmpresa(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Crear o actualizar un Instructor' })
  @ApiBody({ type: UpdateInstructorDto })
  @Put('instructor')
  async updateInstructor(@Body() dto: UpdateInstructorDto) {
    if (!dto.userId)
      throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateInstructor(dto.userId, dto)
  }

  /* ──────────────── NUEVOS ENDPOINTS BASADOS EN JWT ──────────────── */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update full profile (generic)' })
  @ApiBody({ type: UpdateProfileDto })
  @Post('profile')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload/replace profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('profile-image')
  async uploadProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('File required', HttpStatus.BAD_REQUEST)
    return this.usersService.updateProfileImage(req.user.userId, file)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordDto })
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change email' })
  @ApiBody({ type: ChangeEmailDto })
  @Post('change-email')
  async changeEmail(@Req() req, @Body() dto: ChangeEmailDto) {
    return this.usersService.changeEmail(req.user.userId, dto)
  }

  /* ──────────────── QUERIES BASADOS EN JWT ──────────────── */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('medico')
  async getMedico(@Req() req) {
    return this.usersService.getMedicoByUserId(req.user.userId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('empresa')
  async getEmpresa(@Req() req) {
    return this.usersService.getEmpresaByUserId(req.user.userId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('instructor')
  async getInstructor(@Req() req) {
    return this.usersService.getInstructorByUserId(req.user.userId)
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id)
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const { password, ...safe } = user
    return safe
  }
}
