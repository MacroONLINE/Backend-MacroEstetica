// src/users/users.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa, Instructor } from '@prisma/client';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Crear usuario con email y contraseña (Paso 1)
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const updatedData = {
      ...data,
      role: Role.COSMETOLOGO, 
    };
  
    return this.prisma.user.update({
      where: { id },
      data: updatedData,
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }
  
  async createOrUpdateMedico(
    userId: string,
    data: Partial<Prisma.MedicoUncheckedCreateInput>,
  ): Promise<Medico> {
    const createData: Prisma.MedicoUncheckedCreateInput = {
      userId,
      verification: data.verification || '',
    };

    return this.prisma.medico.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: createData,
    });
  }

  // Crear o actualizar información de Empresa
  async createOrUpdateEmpresa(
    userId: string,
    data: Omit<Prisma.EmpresaUncheckedCreateInput, 'userId'>,
  ): Promise<Empresa> {
    if (!data.name) {
      throw new Error("El campo 'name' es obligatorio.");
    }

    // VALIDACIÓN DE DNI DUPLICADO
    if (data.dni) {
      const existing = await this.prisma.empresa.findFirst({
        where: {
          dni: data.dni,
        },
      });

      if (existing) {
        throw new HttpException(
          'Registro duplicado: El DNI ya está en uso.',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Prisma.EmpresaUncheckedUpdateInput = {
      name: data.name,
      giro: data.giro || 'EMPRESA_PROFESIONAL_PERFIL',
      subscription: data.subscription,
      webUrl: data.webUrl,          
      updatedAt: new Date(),
      bannerImage: data.bannerImage,
      logo: data.logo,
      title: data.title,
      profileImage: data.profileImage,
      ceo: data.ceo,
      ceoRole: data.ceoRole,
      location: data.location,
      followers: data.followers,
      dni: data.dni,
    };

    const createData: Prisma.EmpresaUncheckedCreateInput = {
      userId,
      name: data.name,
      giro: data.giro || 'EMPRESA_PROFESIONAL_PERFIL',
      subscription: data.subscription,
      webUrl: data.webUrl,        
      createdAt: new Date(),
      updatedAt: new Date(),
      bannerImage: data.bannerImage,
      logo: data.logo,
      title: data.title,
      profileImage: data.profileImage,
      ceo: data.ceo,
      ceoRole: data.ceoRole,
      location: data.location,
      followers: data.followers,
      dni: data.dni,
    };

    return this.prisma.empresa.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });
  }

  async createOrUpdateInstructor(
    userId: string,
    data: Omit<Prisma.InstructorUncheckedCreateInput, 'userId'>,
  ): Promise<Instructor> {
    return this.prisma.instructor.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  async getMedicoByUserId(userId: string): Promise<Medico | null> {
    return this.prisma.medico.findUnique({
      where: { userId },
    });
  }

  async getEmpresaByUserId(userId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({
      where: { userId },
    });
  }

  async getInstructorByUserId(userId: string): Promise<Instructor | null> {
    return this.prisma.instructor.findUnique({
      where: { userId },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const standardizedEmail = email.trim().toLowerCase();
    return this.prisma.user.findFirst({
      where: { email: standardizedEmail },
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  async checkUserExistsByEmail(email: string): Promise<{ exists: boolean; user?: Partial<User>; debugInfo?: any }> {
    const standardizedEmail = email.trim().toLowerCase();
    const debugInfo: any = {
      receivedEmail: email,
      standardizedEmail: standardizedEmail,
      prismaResult: null,
    };
  
    const user = await this.prisma.user.findFirst({
      where: { email: standardizedEmail },
    });
  
    debugInfo.prismaResult = user;
  
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        exists: true,
        user: userWithoutPassword,
        debugInfo,
      };
    } else {
      return {
        exists: false,
        debugInfo: {
          ...debugInfo,
          message: `User not found for email: ${standardizedEmail}`,
        },
      };
    }
  }
  
  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
