import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) {}

  // Crea un instructor; si deseas calcular 'title' automáticamente (firstName + lastName),
  // necesitarás consultar el user antes de crear.
  async createInstructor(data: CreateInstructorDto) {
    let computedTitle = data.title;
    if (!computedTitle) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { firstName: true, lastName: true },
      });
      if (user) {
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        computedTitle = `${firstName} ${lastName}`.trim();
      }
    }

    return this.prisma.instructor.create({
      data: {
        profession: data.profession,
        type: data.type,
        description: data.description,
        experienceYears: data.experienceYears ?? 0,
        certificationsUrl: data.certificationsUrl,
        status: data.status,
        userId: data.userId,
        empresaId: data.empresaId,
        categoryId: data.categoryId,

        // Campos nuevos:
        bannerImage: data.bannerImage,
        followers: data.followers ?? 0,
        title: computedTitle,
      },
      include: {
        // Incluimos 'user' con select para excluir 'password'
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            // ...otros campos que quieras exponer
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  async getInstructorById(id: string) {
    return this.prisma.instructor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  async getInstructorsByCategory(categoryId: string) {
    return this.prisma.instructor.findMany({
      where: { categoryId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  async getInstructorsByEmpresa(empresaId: string) {
    return this.prisma.instructor.findMany({
      where: { empresaId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  // Listar todos los instructores
  async getAllInstructors() {
    return this.prisma.instructor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  // Actualizar un instructor
  async updateInstructor(id: string, data: Prisma.InstructorUpdateInput) {
    return this.prisma.instructor.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  // Eliminar un instructor
  async deleteInstructor(id: string) {
    return this.prisma.instructor.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }
}
