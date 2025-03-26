import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CourseResponseDto } from './response-dto/course-response.dto';
import { Target } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToCourseResponseDto(course: any): CourseResponseDto {
    return {
      id: course.id,
      instructorId: course.instructorId || null,
      title: course.title,
      description: course.description,
      price: course.price,
      discountPercentage: course.discountPercentage || 0,
      level: course.level,
      target: course.target,
      participantsCount: course.participantsCount,
      rating: course.rating,
      isFeatured: course.isFeatured || false,
      bannerUrl: course.bannerUrl || '',
      courseImageUrl: course.courseImageUrl || '',
      totalHours: course.totalHours || 1,
      aboutDescription: course.aboutDescription || '',
      whatYouWillLearn: course.whatYouWillLearn || [],
      requirements: course.requirements || [],
      categoryName: course.category?.name || 'N/A',
      categoryColor: course.category?.colorHex || 'N/A',
      categoryIcon: course.category?.urlIcon || 'N/A',
      instructorName: `${course.instructor?.user?.firstName || ''} ${course.instructor?.user?.lastName || ''}`.trim() || 'N/A',
      instructorExperience: course.instructor?.experienceYears || 0,
      instructorCertificationsUrl: course.instructor?.certificationsUrl || 'N/A',
      instructorStatus: course.instructor?.status || 'N/A',
      modules: course.modules?.map((module: any) => ({
        id: module.id,
        description: module.description,
        classes: module.classes?.map((cls: any) => ({
          id: cls.id,
          description: cls.description,
          classResources: cls.classResources || [],
        })) || [],
      })) || [],
      totalModules: course.modules?.length || 0,
      resources: course.resources || [],
      totalResources: course.resources?.length || 0,
      comments: course.comments || [],
    };
  }

  async createCourse(data: CreateCourseDto) {
    const { instructorId, categoryId, ...rest } = data;
    return this.prisma.course.create({
      data: {
        ...rest,
        instructorId,
        categoryId,
      },
    });
  }

  async createModule(data: CreateModuleDto) {
    const { courseId, description } = data;
    const courseExists = await this.prisma.course.findUnique({ where: { id: courseId } });
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
    const moduleExists = await this.prisma.module.findUnique({ where: { id: moduleId } });
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
    const classExists = await this.prisma.class.findUnique({ where: { id: classId } });
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
    return this.prisma.category.create({ data });
  }

  async getAllCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: {
              include: { classResources: true },
            },
          },
        },
        resources: true,
        comments: true,
      },
    });
    return courses.map((course) => this.mapToCourseResponseDto(course));
  }

  async getCourseById(courseId: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: {
              include: { classResources: true },
            },
          },
        },
        resources: true,
        comments: true,
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
    return this.mapToCourseResponseDto(course);
  }

  async getFeaturedCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: { include: { classResources: true } },
          },
        },
        resources: true,
        comments: true,
      },
    });
    return courses.map((course) => this.mapToCourseResponseDto(course));
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { categoryId },
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: { include: { classResources: true } },
          },
        },
        resources: true,
        comments: true,
      },
    });
    return courses.map((course) => this.mapToCourseResponseDto(course));
  }

  async getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: { include: { classResources: true } },
          },
        },
        resources: true,
        comments: true,
      },
    });
    return courses.map((course) => this.mapToCourseResponseDto(course));
  }

  async getCoursesByTarget(target: Target): Promise<CourseResponseDto[]> {
    const validatedTarget = Object.values(Target).includes(target) ? target : Target.COSMETOLOGO;
    const courses = await this.prisma.course.findMany({
      where: { target: validatedTarget },
      include: {
        category: true,
        instructor: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
          },
        },
        modules: {
          include: {
            classes: { include: { classResources: true } },
          },
        },
        resources: true,
        comments: true,
      },
    });
    return courses.map((course) => this.mapToCourseResponseDto(course));
  }

  async getUserCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: { classes: true },
            },
          },
        },
      },
    });

    const result = [];
    for (const e of enrollments) {
      const course = e.course;
      const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);

      // Buscamos el progreso usando un filtro "in" en classId
      const userProgress = await this.prisma.classProgress.findMany({
        where: {
          userId,
          classId: {
            in: course.modules.flatMap((m) => m.classes.map((c) => c.id)),
          },
        },
      });

      const completedClasses = userProgress.filter((p) => p.completed).length;
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
          isCompleted,
        },
      });
    }
    return result;
  }

  async getUserCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.courseEnrollment.findFirst({
      where: { userId, courseId },
    });
    if (!enrollment) {
      throw new NotFoundException('User not enrolled in this course');
    }
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { include: { classes: true } },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
    const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0);

    // Uso de "in" para filtrar múltiples IDs
    const userProgress = await this.prisma.classProgress.findMany({
      where: {
        userId,
        classId: {
          in: course.modules.flatMap((m) => m.classes.map((c) => c.id)),
        },
      },
    });
    const completedClasses = userProgress.filter((p) => p.completed).length;
    return {
      courseId,
      totalClasses,
      completedClasses,
      isCompleted: completedClasses === totalClasses && totalClasses > 0,
    };
  }

  async getClassById(classId: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        classResources: true,
      },
    });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    return cls;
  }

  async isUserEnrolled(courseId: string, userId: string): Promise<{ enrolled: boolean }> {
    const enrollment = await this.prisma.courseEnrollment.findFirst({
      where: {
        courseId,
        userId,
      },
    });
    return { enrolled: !!enrollment };
  }

  async getModulesByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: {
        classes: {
          include: {
            classResources: true,
          },
        },
      },
    });
  }

  async getModuleById(moduleId: string) {
    return this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        classes: {
          include: {
            classResources: true,
          },
        },
      },
    });
  }

  async getUserModuleProgress(moduleId: string, userId: string) {
    const classes = await this.prisma.class.findMany({
      where: { moduleId },
      include: {
        progress: {
          where: {
            userId,
            completed: true,
          },
        },
        classResources: true,
      },
    });

    return classes.map((cls) => ({
      classId: cls.id,
      description: cls.description,
      completed: cls.progress.length > 0,
      classResources: cls.classResources,
    }));
  }

  /**
   * Marcar una clase como completada para un usuario
   */
  async markClassAsCompleted(userId: string, classId: string) {
    const cls = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!cls) {
      throw new NotFoundException('Class not found');
    }
    // Buscamos si existe un registro en ClassProgress
    const existingProgress = await this.prisma.classProgress.findFirst({
      where: { userId, classId },
    });

    if (!existingProgress) {
      // Lo creamos si no existe
      return this.prisma.classProgress.create({
        data: {
          userId,
          classId,
          completed: true,
        },
      });
    } else {
      // Lo actualizamos si sí existe
      return this.prisma.classProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: true,
          updatedAt: new Date(),
        },
      });
    }
  }
}
