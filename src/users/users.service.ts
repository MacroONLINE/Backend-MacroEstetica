import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import {
  Prisma,
  Role,
  User,
  Medico,
  Empresa,
  Instructor,
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { UpdateProfileDto } from './dto/update-profile.dto/update-profile.dto'
import { UpdateMedicoDto } from './dto/update-medico.dto'
import { UpdateEmpresaDto } from './dto/update-empresa.dto'
import { UpdateInstructorDto } from './dto/update-instructor.dto'
import { ChangePasswordDto } from './dto/change-password.dto/change-password.dto'
import { ChangeEmailDto } from './dto/change-email.dto/change-email.dto'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  /* ──────────────── CREACIÓN BÁSICA ──────────────── */

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: { medico: true, empresa: true, instructor: true },
    })
  }

  /* ──────────────── ACTUALIZACIÓN GENERAL (LEGACY) ──────────────── */

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { ...data, role: Role.COSMETOLOGO },
      include: { medico: true, empresa: true, instructor: true },
    })
  }

  /* ──────────────── MÉDICO ──────────────── */

  async createOrUpdateMedico(
    userId: string,
    dto: UpdateMedicoDto,
  ): Promise<Medico> {
    return this.prisma.medico.upsert({
      where: { userId },
      update: dto,
      create: { ...dto, userId, verification: dto.verification || '' },
    })
  }

  /* ──────────────── EMPRESA ──────────────── */

  async createOrUpdateEmpresa(
    userId: string,
    dto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    if (!dto.name)
      throw new HttpException('name required', HttpStatus.BAD_REQUEST)

    if (dto.dni) {
      const duplicate = await this.prisma.empresa.findFirst({
        where: { dni: dto.dni, userId: { not: userId } },
      })
      if (duplicate)
        throw new HttpException('DNI already in use', HttpStatus.CONFLICT)
    }

    return this.prisma.empresa.upsert({
      where: { userId },
      update: dto,
      create: { ...dto, userId },
    })
  }

  /* ──────────────── INSTRUCTOR ──────────────── */

  async createOrUpdateInstructor(
    userId: string,
    dto: UpdateInstructorDto,
  ): Promise<Instructor> {
    const { userId: _discard, ...data } = dto
    return this.prisma.instructor.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        user: { connect: { id: userId } }, // ‹userId› se conecta por relación
      } as Prisma.InstructorCreateInput,
    })
  }

// users.service.ts  ➜  reemplaza únicamente el método updateProfile

async updateProfile(
  userId: string,
  dto: UpdateProfileDto,
  file?: Express.Multer.File,
) {
  let uploadedUrl: string | undefined
  if (file) {
    const up = await this.cloudinary.uploadImage(file)
    uploadedUrl = up.secure_url
  }

  const { medico, empresa, instructor, ...userFields } = dto
  await this.prisma.user.update({ where: { id: userId }, data: userFields })

  const user = await this.prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

  if (user.role === Role.MEDICO) {
    const med: UpdateMedicoDto = {
      userId,
      ...(medico ?? {}),
      ...(uploadedUrl ? { verification: uploadedUrl } : {}),
    }
    await this.createOrUpdateMedico(userId, med)
  }

  if (user.role === Role.EMPRESA && empresa)
    await this.createOrUpdateEmpresa(userId, empresa)

  if (user.role === Role.INSTRUCTOR && instructor)
    await this.createOrUpdateInstructor(userId, instructor)

  return this.findUserById(userId)
}



  /* ──────────────── FOTO DE PERFIL ──────────────── */

  async updateProfileImage(userId: string, file: Express.Multer.File) {
    const upload = await this.cloudinary.uploadImage(file)
    return this.prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: upload.secure_url },
    })
  }

  /* ──────────────── PASSWORD & EMAIL ──────────────── */

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    const ok = await bcrypt.compare(dto.currentPassword, user.password)
    if (!ok) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN)

    const hash = await bcrypt.hash(dto.newPassword, 10)
    await this.prisma.user.update({ where: { id: userId }, data: { password: hash } })
    return { message: 'Password updated' }
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    const ok = await bcrypt.compare(dto.password, user.password)
    if (!ok) throw new HttpException('Invalid password', HttpStatus.FORBIDDEN)

    const email = dto.newEmail.trim().toLowerCase()
    const exists = await this.prisma.user.findFirst({ where: { email } })
    if (exists && exists.id !== userId)
      throw new HttpException('Email already in use', HttpStatus.CONFLICT)

    await this.prisma.user.update({ where: { id: userId }, data: { email } })
    return { message: 'Email updated' }
  }

  /* ──────────────── QUERIES ──────────────── */

  async getMedicoByUserId(userId: string): Promise<Medico | null> {
    return this.prisma.medico.findUnique({ where: { userId } })
  }

  async getEmpresaByUserId(userId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({ where: { userId } })
  }

  async getInstructorByUserId(userId: string): Promise<Instructor | null> {
    return this.prisma.instructor.findUnique({ where: { userId } })
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { medico: true, empresa: true, instructor: true },
    })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const e = email.trim().toLowerCase()
    return this.prisma.user.findFirst({
      where: { email: e },
      include: { medico: true, empresa: true, instructor: true },
    })
  }

  async checkUserExistsByEmail(email: string) {
    const e = email.trim().toLowerCase()
    const user = await this.prisma.user.findFirst({ where: { email: e } })
    if (user) {
      const { password, ...safe } = user
      return { exists: true, user: safe }
    }
    return { exists: false }
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }
}
