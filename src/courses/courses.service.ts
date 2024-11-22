import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CoursesFetchDto } from './dto/courses-fetch.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // Crear un curso
  async createCourse(data: CreateCourseDto) {
    return this.prisma.course.create({ data });
  }

  // Crear un módulo
  async createModule(data: CreateModuleDto) {
    return this.prisma.module.create({ data });
  }

  // Crear una clase
  async createClass(data: CreateClassDto) {
    return this.prisma.class.create({ data });
  }

  // Crear un comentario
  async createComment(data: CreateCommentDto) {
    // Desestructurar los datos del DTO
    const { userId, classId, type, rating, content } = data;

    return this.prisma.comment.create({
      data: {
        user: {
          connect: { id: userId },
        },
        class: {
          connect: { id: classId },
        },
        type,
        rating,
        content,
      },
    });
  }

  // Crear una categoría
  async createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  // Obtener todos los cursos
  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          include: { classes: true },
        },
        categories: {
          include: { category: true },
        },
      },
    });
  }

  // Obtener cursos destacados
  async getFeaturedCourses() {
    return this.prisma.course.findMany({
      where: { featured: true },
      include: {
        instructor: true,
        categories: {
          include: { category: true },
        },
      },
    });
  }

  // Obtener módulos por el ID del curso
  async getModulesByCourseId(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: { classes: true },
    });
  }

  // Obtener clases por el ID del módulo
  async getClassesByModuleId(moduleId: string) {
    return this.prisma.class.findMany({
      where: { moduleId },
      include: {
        comments: true,
      },
    });
  }
 

  async getFeaturedCoursesFetch(): Promise<CoursesFetchDto[]> {
    return this.prisma.coursesFetch.findMany({
      where: { featured: true },
    });
  }
}
