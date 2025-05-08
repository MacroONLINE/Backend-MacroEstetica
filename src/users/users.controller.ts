import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Query,
  Param,
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
  @ApiBody({ type: UpdateEmpresaDto })
  @Put('empresa')
  async updateEmpresa(@Body() dto: UpdateEmpresaDto) {
    if (!dto.userId) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateEmpresa(dto.userId, dto)
  }

  @ApiOperation({ summary: 'Crear o actualizar un Instructor' })
  @ApiBody({ type: UpdateInstructorDto })
  @Put('instructor')
  async updateInstructor(@Body() dto: UpdateInstructorDto) {
    if (!dto.userId) throw new HttpException('User ID required', HttpStatus.BAD_REQUEST)
    return this.usersService.createOrUpdateInstructor(dto.userId, dto)
  }

@ApiOperation({ summary: 'Update full profile (generic)' })
@ApiParam({ name: 'userId', description: 'User ID' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  description:
    'Datos del usuario + secciones (medico, instructor, empresa) que apliquen. ' +
    'Puedes adjuntar opcionalmente un archivo `file` (binary) para reemplazar el documento cargado al crear la cuenta.',
  schema: {
    type: 'object',
    properties: {
      /* …campos de UpdateProfileDto… */
      file: { type: 'string', format: 'binary' },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
@Put(':userId/profile')
async updateProfile(
  @Param('userId') userId: string,
  @Body() dto: UpdateProfileDto,
  @UploadedFile() file?: Express.Multer.File,
) {
  return this.usersService.updateProfile(userId, dto, file)
}


  @ApiOperation({ summary: 'Upload or replace profile picture' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Put(':userId/profile-image')
  async uploadProfileImage(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException('File required', HttpStatus.BAD_REQUEST)
    return this.usersService.updateProfileImage(userId, file)
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: ChangePasswordDto })
  @Put(':userId/change-password')
  async changePassword(@Param('userId') userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto)
  }

  @ApiOperation({ summary: 'Change email' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: ChangeEmailDto })
  @Put(':userId/change-email')
  async changeEmail(@Param('userId') userId: string, @Body() dto: ChangeEmailDto) {
    return this.usersService.changeEmail(userId, dto)
  }

  @ApiOperation({ summary: 'Get MEDICO details for current user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get(':userId/medico')
  async getMedico(@Param('userId') userId: string) {
    return this.usersService.getMedicoByUserId(userId)
  }

  @ApiOperation({ summary: 'Get EMPRESA details for current user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get(':userId/empresa')
  async getEmpresa(@Param('userId') userId: string) {
    return this.usersService.getEmpresaByUserId(userId)
  }

  @ApiOperation({ summary: 'Get INSTRUCTOR details for current user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get(':userId/instructor')
  async getInstructor(@Param('userId') userId: string) {
    return this.usersService.getInstructorByUserId(userId)
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
