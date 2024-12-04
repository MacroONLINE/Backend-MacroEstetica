import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(data: CreateCourseDto) {
    const { instructorId, categoryId, ...rest } = data;

    return this.prisma.course.create({
      data: {
        ...rest,
        instructor: instructorId ? { connect: { id: instructorId } } : undefined,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
        category: true, // Include category details
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    return course;
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async getFeaturedCourses() {
    return this.prisma.course.findMany({
      where: { isFeatured: true }, // Filtra los cursos destacados
      include: {
        instructor: true,
        category: true, // Incluye los detalles de la categoría
      },
    });
  }

  async getCoursesByCategory(categoryId: string) {
    return this.prisma.course.findMany({
      where: { categoryId },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async getCoursesByInstructor(instructorId: string) {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async getCoursesByTarget(target: string) {
    // Validar el target o asignar el valor predeterminado
    const validatedTarget: Target = 
      Object.values(Target).includes(target as Target) 
        ? (target as Target) 
        : Target.ESTETICISTA;

    return this.prisma.course.findMany({
      where: {
        target: validatedTarget, // Asignar el target validado
      },
      include: {
        instructor: true,
        category: true,
      },
    });
  }

  async createModule(data: CreateModuleDto) {
    const { courseId, description } = data;

    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    return this.prisma.module.create({
      data: {
        courseId,
        description,
      },
    });
  }

  async createClass(data: CreateClassDto) {
    const { moduleId, description } = data;

    const moduleExists = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }

    return this.prisma.class.create({
      data: {
        moduleId,
        description,
      },
    });
  }

  async createComment(data: CreateCommentDto) {
    const { userId, classId, type, rating, content } = data;

    const classExists = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      throw new NotFoundException(`Class with ID ${classId} not found.`);
    }

    return this.prisma.comment.create({
      data: {
        userId,
        classId,
        type,
        rating,
        content,
      },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    const { name, urlIcon, colorHex } = data;

    return this.prisma.category.create({
      data: {
        name,
        urlIcon,
        colorHex,
      },
    });
  }

  async getModulesByCourseId(courseId: string) {
    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    return this.prisma.module.findMany({
      where: { courseId },
    });
  }

  async getClassesByModuleId(moduleId: string) {
    const moduleExists = await this.prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }

    return this.prisma.class.findMany({
      where: { moduleId },
    });
  }
}
