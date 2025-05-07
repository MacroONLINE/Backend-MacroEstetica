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
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger'
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
  @ApiResponse({
    status: 200,
    description: 'Returns { exists: boolean, user?: Partial<User> }',
  })
  @Get('check-email')
  async checkUserByEmail(@Query('email') email: string) {
    if (!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
    return this.usersService.checkUserExistsByEmail(email)
  }

  @ApiOperation({ summary: 'Register a new user (Step 1)' })
  @ApiResponse({ status: 201, description: 'User created, returns userId' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const exists = await this.usersService.findUserByEmail(dto.email)
    if (exists) throw new HttpException('User already exists', HttpStatus.CONFLICT)
    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.usersService.createUser({ ...dto, password: hashed })
    return { message: 'User created successfully', userId: user.id }
  }

  @ApiOperation({ summary: 'Complete user profile (legacy Step 2)' })
  @Put('complete-profile')
  async completeProfile(@Body() dto: UpdateUserDto) {
    if (!dto.id) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    await this.usersService.updateUser(dto.id, dto)
    return { message: 'User profile updated successfully' }
  }

  @ApiOperation({ summary: 'Crear o actualizar un Medico' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Si se envía archivo, utilizar field `file` (multipart).',
    schema: {
      type: 'object',
      required: ['userId', 'profession', 'type'],
      properties: {
        userId: { type: 'string', example: 'cm4sths4i0008g1865nsbbh1l' },
        profession: { type: 'string', example: 'MEDICO_MEDICINA_ESTETICA' },
        type: { type: 'string', example: 'MEDICO' },
        verification: { type: 'string', example: 'https://cdn.miapp.com/docs/certificado.pdf' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put('medico')
  async updateMedico(@UploadedFile() file: Express.Multer.File, @Body() dto: UpdateMedicoDto) {
    if (!dto.userId) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    if (file) dto.verification = (await this.usersService['cloudinary'].uploadImage(file)).secure_url
    return this.usersService.createOrUpdateMedico(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Crear o actualizar una Empresa' })
  @ApiBody({
    type: UpdateEmpresaDto,
    examples: {
      full: {
        summary: 'Ejemplo completo',
        value: {
          userId: 'cm4sths4i0008g1865nsbbh1l',
          name: 'DermaTech SA',
          dni: 'RFC-12345678',
          giro: 'EMPRESA_PROFESIONAL_PERFIL',
          subscription: 'ORO',
          bannerImage: 'https://cdn.miapp.com/banners/dermatech.jpg',
          logo: 'https://cdn.miapp.com/logos/dermatech.png',
          webUrl: 'https://dermatech.mx',
          followers: 300,
        },
      },
    },
  })
  @Put('empresa')
  async updateEmpresa(@Body() dto: UpdateEmpresaDto) {
    if (!dto.userId) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateEmpresa(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Crear o actualizar un Instructor' })
  @ApiBody({
    type: UpdateInstructorDto,
    examples: {
      basic: {
        summary: 'Ejemplo básico',
        value: {
          userId: 'cm4sths4i0008g1865nsbbh1l',
          profession: 'MEDICINA_ESTETICA',
          type: 'MEDICO',
          description: 'Especialista en peelings químicos',
          experienceYears: 5,
          certificationsUrl: 'https://cdn.miapp.com/certificaciones',
          status: 'active',
          bannerImage: 'https://cdn.miapp.com/banners/instructor.jpg',
          followers: 80,
          validated: false,
        },
      },
    },
  })
  @Put('instructor')
  async updateInstructor(@Body() dto: UpdateInstructorDto) {
    if (!dto.userId) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateInstructor(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Update full profile (generic)' })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Envía solo las secciones (medico, instructor, empresa) que apliquen para el rol del usuario.',
    examples: {
      medico: {
        summary: 'Ejemplo MEDICO',
        value: {
          firstName: 'Ana',
          lastName: 'Ramírez',
          phone: '+525511223344',
          medico: {
            profession: 'MEDICO_MEDICINA_ESTETICA',
            type: 'MEDICO',
            verification: 'https://cdn.miapp.com/docs/ana-certificado.pdf',
          },
        },
      },
      instructor: {
        summary: 'Ejemplo INSTRUCTOR',
        value: {
          firstName: 'Carlos',
          lastName: 'Díaz',
          instructor: {
            profession: 'MEDICINA_ESTETICA',
            type: 'MEDICO',
            description: 'Experto en láser dermatológico',
            experienceYears: 10,
            certificationsUrl: 'https://cdn.miapp.com/certificados/carlos',
            status: 'active',
            bannerImage: 'https://cdn.miapp.com/banners/carlos.jpg',
            validated: true,
          },
        },
      },
      empresa: {
        summary: 'Ejemplo EMPRESA',
        value: {
          firstName: 'Laura',
          lastName: 'Gómez',
          empresa: {
            name: 'Spa Belleza',
            dni: 'RFC-98765432',
            giro: 'EMPRESA_APARATOLOGIA_PERFIL',
            subscription: 'PLATA',
            bannerImage: 'https://cdn.miapp.com/banners/spa.jpg',
            logo: 'https://cdn.miapp.com/logos/spa.png',
            webUrl: 'https://spabelleza.mx',
          },
        },
      },
    },
  })
  @Put('profile')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto)
  }

  @ApiOperation({ summary: 'Upload/replace profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put('profile-image')
  async uploadProfileImage(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('File required', HttpStatus.BAD_REQUEST)
    return this.usersService.updateProfileImage(req.user.userId, file)
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBody({
    type: ChangePasswordDto,
    examples: {
      demo: {
        summary: 'Ejemplo',
        value: {
          currentPassword: 'OldPass123!',
          newPassword: 'NewPass456!',
        },
      },
    },
  })
  @Put('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto)
  }

  @ApiOperation({ summary: 'Change email' })
  @ApiBody({
    type: ChangeEmailDto,
    examples: {
      demo: {
        summary: 'Ejemplo',
        value: {
          password: 'MyPass123!',
          newEmail: 'nuevo@correo.com',
        },
      },
    },
  })
  @Put('change-email')
  async changeEmail(@Req() req, @Body() dto: ChangeEmailDto) {
    return this.usersService.changeEmail(req.user.userId, dto)
  }

  @ApiOperation({ summary: 'Get MEDICO details for current user' })
  @Get('medico')
  async getMedico(@Req() req) {
    return this.usersService.getMedicoByUserId(req.user.userId)
  }

  @ApiOperation({ summary: 'Get EMPRESA details for current user' })
  @Get('empresa')
  async getEmpresa(@Req() req) {
    return this.usersService.getEmpresaByUserId(req.user.userId)
  }

  @ApiOperation({ summary: 'Get INSTRUCTOR details for current user' })
  @Get('instructor')
  async getInstructor(@Req() req) {
    return this.usersService.getInstructorByUserId(req.user.userId)
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found (password omitted)' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id)
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const { password, ...safe } = user
    return safe
  }
}
