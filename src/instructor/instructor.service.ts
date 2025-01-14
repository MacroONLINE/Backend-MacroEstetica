import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructorService {
  constructor(private readonly prisma: PrismaService) {}

  async createInstructor(data: CreateInstructorDto) {
    return this.prisma.instructor.create({
      data: {
        // Ajusta según la estructura del DTO
        profession: data.profession,
        type: data.type,
        description: data.description,
        experienceYears: data.experienceYears ?? 0,
        certificationsUrl: data.certificationsUrl,
        status: data.status,
        userId: data.userId,
        empresaId: data.empresaId,
        categoryId: data.categoryId,
      },
    });
  }

  async getInstructorById(id: string) {
    return this.prisma.instructor.findUnique({
      where: { id },
      include: {
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
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  // Opcional: Listar todos los instructores
  async getAllInstructors() {
    return this.prisma.instructor.findMany({
      include: {
        category: true,
        empresa: true,
        courses: true,
        events: true,
      },
    });
  }

  // Opcional: Actualizar un instructor
  async updateInstructor(id: string, data: Prisma.InstructorUpdateInput) {
    return this.prisma.instructor.update({
      where: { id },
      data,
    });
  }

  // Opcional: Eliminar un instructor
  async deleteInstructor(id: string) {
    return this.prisma.instructor.delete({
      where: { id },
    });
  }
}
