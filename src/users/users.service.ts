import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Medico, Empresa } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
      include: {
        medico: true,
        empresa: true,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        medico: true,
        empresa: true,
      },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        medico: true,
        empresa: true,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        medico: true,
        empresa: true,
      },
    });
  }

  // New methods for Medico
  async getMedicoByUserId(userId: string): Promise<Medico | null> {
    return this.prisma.medico.findUnique({
      where: { userId },
    });
  }

  async updateMedico(userId: string, data: Prisma.MedicoUpdateInput): Promise<Medico> {
    return this.prisma.medico.update({
      where: { userId },
      data,
    });
  }

  // New methods for Empresa
  async getEmpresaByUserId(userId: string): Promise<Empresa | null> {
    return this.prisma.empresa.findUnique({
      where: { userId },
    });
  }

  async updateEmpresa(userId: string, data: Prisma.EmpresaUpdateInput): Promise<Empresa> {
    return this.prisma.empresa.update({
      where: { userId },
      data,
    });
  }
}
