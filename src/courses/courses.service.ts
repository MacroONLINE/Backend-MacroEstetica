// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtener todos los cursos con sus módulos y clases
  async getAllCourses() {
    return this.prisma.course.findMany({
      include: {
        instructor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, profileImageUrl: true }
            }
          }
        },
        modules: {
          include: {
            classes: {
              include: { classResources: true }
            }
          }
        }
      }
    });
  }

  // Obtener curso por ID (con módulos, clases, resources)
  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        modules: {
          include: {
            classes: {
              include: {
                classResources: true
              }
            }
          }
        }
      }
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  // Obtener el listado de cursos en que un usuario está inscrito, con progreso
  async getUserCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: { classes: true }
            }
          }
        }
      }
    });
    // Calcular si el curso está completado
    // Se considera completado si todas las clases del curso las tiene completed = true en ClassProgress
    const result = [];
    for (const e of enrollments) {
      const course = e.course;
      const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);
      const userProgress = await this.prisma.classProgress.findMany({
        where: { userId, classId: { in: course.modules.flatMap(m => m.classes.map(c => c.id)) } }
      });
      const completedClasses = userProgress.filter(p => p.completed).length;
      const isCompleted = completedClasses === totalClasses && totalClasses > 0;
      result.push({
        enrollmentId: e.id,
        enrolledAt: e.enrolledAt,
        course: {
          id: course.id,
          title: course.title,
          target: course.target,
          totalClasses,
          completedClasses,
          isCompleted
        }
      });
    }
    return result;
  }

  // Obtener progreso de un usuario dentro de un curso específico
  async getUserCourseProgress(userId: string, courseId: string) {
    // Verificar si el usuario está inscrito
    const enrollment = await this.prisma.courseEnrollment.findFirst({
      where: { userId, courseId }
    });
    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }
    // Obtener las clases y ver cuántas están completadas
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { classes: true } } }
    });
    const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);

    const userProgress = await this.prisma.classProgress.findMany({
      where: { userId, classId: { in: course.modules.flatMap(m => m.classes.map(c => c.id)) } }
    });
    const completedClasses = userProgress.filter(p => p.completed).length;

    return {
      courseId: courseId,
      totalClasses,
      completedClasses,
      isCompleted: (completedClasses === totalClasses && totalClasses > 0)
    };
  }

  // Obtener datos de una clase con su recurso
  async getClassById(classId: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        classResources: true
      }
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }
}
