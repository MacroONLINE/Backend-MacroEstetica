// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa, Instructor } from '@prisma/client';

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

  // Actualizar perfil de usuario (Paso 2)
  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    // Solo actualiza el perfil básico del usuario sin manejar datos específicos de roles
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  // Crear o actualizar información de Medico
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

    return this.prisma.empresa.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        ...data,
        userId,
      },
    });
  }

  // Crear o actualizar información de Instructor
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

  // Obtener Medico por ID de usuario
  async getMedicoByUserId(userId: string): Promise<Medico | null> {
    return this.prisma.medico.findUnique({
      where: { userId },
    });
  }

  // Obtener Empresa por ID de usuario
  async getEmpresaByUserId(userId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({
      where: { userId },
    });
  }

  // Obtener Instructor por ID de usuario
  async getInstructorByUserId(userId: string): Promise<Instructor | null> {
    return this.prisma.instructor.findUnique({
      where: { userId },
    });
  }

  // Encontrar usuario por email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        medico: true,
        empresa: true,
        instructor: true,
      },
    });
  }

  // Encontrar usuario por ID
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
}
