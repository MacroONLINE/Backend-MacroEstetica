import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';
import { CourseResponseDto } from './response-dto/course-response.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToCourseResponseDto(course: any): CourseResponseDto {
    const totalModules = course.modules?.length || 0;
    const totalResources = course.resources?.length || 0;

    return {
      id: course.id,
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
        classes: module.classes || [],
      })) || [],
      totalModules,
      resources: course.resources || [],
      totalResources,
    };
  }

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

  async getCourseById(courseId: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: {
          include: {
            classes: true,
          },
        },
        resources: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    return this.mapToCourseResponseDto(course);
  }

  async getAllCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: true,
        resources: true,
      },
    });

    return courses.map(this.mapToCourseResponseDto);
  }

  async getFeaturedCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: true,
        resources: true,
      },
    });

    return courses.map(this.mapToCourseResponseDto);
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { categoryId },
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: true,
        resources: true,
      },
    });

    return courses.map(this.mapToCourseResponseDto);
  }

  async getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: true,
        resources: true,
      },
    });

    return courses.map(this.mapToCourseResponseDto);
  }

  async getCoursesByTarget(target: string): Promise<CourseResponseDto[]> {
    const validatedTarget: Target =
      Object.values(Target).includes(target as Target)
        ? (target as Target)
        : Target.ESTETICISTA;

    const courses = await this.prisma.course.findMany({
      where: { target: validatedTarget },
      include: {
        category: true,
        instructor: {
          include: { user: true },
        },
        modules: true,
        resources: true,
      },
    });

    return courses.map(this.mapToCourseResponseDto);
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
}
