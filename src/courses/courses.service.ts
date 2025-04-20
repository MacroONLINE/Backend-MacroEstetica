// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateModuleDto } from './dto/create-module.dto'
import { CreateClassDto } from './dto/create-class.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { CourseResponseDto } from './response-dto/course-response.dto'
import { CourseCardDto } from './dto/course-card.dto/course-card.dto'
import { Target } from '@prisma/client'
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto'

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
      instructorName:
        `${course.instructor?.user?.firstName || ''} ${course.instructor?.user?.lastName || ''}`.trim() ||
        'N/A',
      instructorExperience: course.instructor?.experienceYears || 0,
      instructorCertificationsUrl: course.instructor?.certificationsUrl || 'N/A',
      instructorStatus: course.instructor?.status || 'N/A',
      modules:
        course.modules?.map((m: any) => ({
          id: m.id,
          description: m.description,
          classes:
            m.classes?.map((cls: any) => ({
              id: cls.id,
              description: cls.description,
              classResources: cls.classResources || [],
            })) || [],
        })) || [],
      totalModules: course.modules?.length || 0,
      resources: course.resources || [],
      totalResources: course.resources?.length || 0,
      comments: [],
    }
  }

  async createCourse(dto: CreateCourseDto) {
    const { instructorId, categoryId, ...rest } = dto
    return this.prisma.course.create({ data: { ...rest, instructorId, categoryId } })
  }

  async createModule(dto: CreateModuleDto) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } })
    if (!course) throw new NotFoundException(`Course with ID ${dto.courseId} not found.`)
    return this.prisma.module.create({ data: { courseId: dto.courseId, description: dto.description } })
  }

  async createClass(dto: CreateClassDto) {
    const mod = await this.prisma.module.findUnique({ where: { id: dto.moduleId } })
    if (!mod) throw new NotFoundException(`Module with ID ${dto.moduleId} not found.`)
    return this.prisma.class.create({ data: { moduleId: dto.moduleId, description: dto.description } })
  }

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto })
  }

  async getAllCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    return courses.map((c) => this.mapToCourseResponseDto(c))
  }

  async getCourseById(courseId: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    if (!course) throw new NotFoundException(`Course with ID ${courseId} not found.`)
    return this.mapToCourseResponseDto(course)
  }

  async getFeaturedCourses(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    return courses.map((c) => this.mapToCourseResponseDto(c))
  }

  async getCoursesByCategory(categoryId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { categoryId },
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    return courses.map((c) => this.mapToCourseResponseDto(c))
  }

  async getCoursesByInstructor(instructorId: string): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    return courses.map((c) => this.mapToCourseResponseDto(c))
  }

  async getCoursesByTarget(target: Target): Promise<CourseResponseDto[]> {
    const valid = Object.values(Target).includes(target) ? target : Target.COSMETOLOGO
    const courses = await this.prisma.course.findMany({
      where: { target: valid },
      include: {
        category: true,
        instructor: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        modules: { include: { classes: { include: { classResources: true } } } },
        resources: true,
      },
    })
    return courses.map((c) => this.mapToCourseResponseDto(c))
  }

  async getUserCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: { include: { modules: { include: { classes: true } } } },
      },
    })
    const result = []
    for (const e of enrollments) {
      const course = e.course
      const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0)
      const progress = await this.prisma.classProgress.findMany({
        where: { userId, classId: { in: course.modules.flatMap((m) => m.classes.map((c) => c.id)) } },
      })
      const completedClasses = progress.filter((p) => p.completed).length
      const isCompleted = completedClasses === totalClasses && totalClasses > 0
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
      })
    }
    return result
  }

  async getUserCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.courseEnrollment.findFirst({ where: { userId, courseId } })
    if (!enrollment) throw new NotFoundException('User not enrolled in this course')

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { classes: true } } },
    })
    if (!course) throw new NotFoundException(`Course with ID ${courseId} not found.`)

    const totalClasses = course.modules.reduce((acc, m) => acc + m.classes.length, 0)
    const progress = await this.prisma.classProgress.findMany({
      where: { userId, classId: { in: course.modules.flatMap((m) => m.classes.map((c) => c.id)) } },
    })
    const completedIds = progress.filter((p) => p.completed).map((p) => p.classId)
    return {
      courseId,
      totalClasses,
      completedClasses: completedIds.length,
      completedClassIds: completedIds,
      isCompleted: completedIds.length === totalClasses && totalClasses > 0,
    }
  }

  async getClassById(classId: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        classResources: true,
        classComments: {
          where: { parentCommentId: null },
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
            replies: {
              include: {
                user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
              },
            },
          },
        },
      },
    })
    if (!cls) throw new NotFoundException('Class not found')
    return cls
  }

  async isUserEnrolled(courseId: string, userId: string) {
    const enrollment = await this.prisma.courseEnrollment.findFirst({ where: { courseId, userId } })
    return { enrolled: !!enrollment }
  }

  async getModulesByCourse(courseId: string) {
    return this.prisma.module.findMany({
      where: { courseId },
      include: {
        classes: {
          include: {
            classResources: true,
            classComments: {
              where: { parentCommentId: null },
              include: {
                user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                replies: {
                  include: {
                    user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getModuleById(moduleId: string) {
    const mod = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        classes: {
          include: {
            classResources: true,
            classComments: {
              where: { parentCommentId: null },
              include: {
                user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                replies: {
                  include: {
                    user: { select: { firstName: true, lastName: true, profileImageUrl: true } },
                  },
                },
              },
            },
          },
        },
      },
    })
    if (!mod) throw new NotFoundException(`Module with ID ${moduleId} not found.`)
    return mod
  }

  async getUserModuleProgress(moduleId: string, userId: string) {
    const classes = await this.prisma.class.findMany({
      where: { moduleId },
      include: {
        progress: { where: { userId, completed: true } },
        classResources: true,
      },
    })
    return classes.map((cls) => ({
      classId: cls.id,
      description: cls.description,
      completed: cls.progress.length > 0,
      classResources: cls.classResources,
    }))
  }

  async markClassAsCompleted(userId: string, classId: string) {
    const cls = await this.prisma.class.findUnique({ where: { id: classId } })
    if (!cls) throw new NotFoundException('Class not found')

    const existing = await this.prisma.classProgress.findFirst({ where: { userId, classId } })
    if (!existing) {
      return this.prisma.classProgress.create({ data: { userId, classId, completed: true } })
    }
    return this.prisma.classProgress.update({
      where: { id: existing.id },
      data: { completed: true, updatedAt: new Date() },
    })
  }

  async createClassComment(dto: CreateCommentDto) {
    const { userId, classId, content, parentCommentId } = dto
    const cls = await this.prisma.class.findUnique({ where: { id: classId } })
    if (!cls) throw new NotFoundException(`Class with ID ${classId} not found.`)

    if (parentCommentId) {
      const parent = await this.prisma.classComment.findUnique({ where: { id: parentCommentId } })
      if (!parent) throw new NotFoundException(`Parent comment ${parentCommentId} not found.`)
    }

    return this.prisma.classComment.create({
      data: { userId, classId, content, parentCommentId: parentCommentId || null },
    })
  }

  async getActiveCoursesCardInfo(userId: string): Promise<ActiveCoursesDto> {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            bannerUrl: true,
            category: { select: { name: true, colorHex: true } },
            instructor: { include: { user: { select: { firstName: true, lastName: true } } } },
            modules: {
              select: {
                id: true,
                description: true,
                classes: { select: { id: true } },
              },
            },
          },
        },
      },
    })
  
    if (!enrollments.length) return { userId, courses: [] }
  
    const allIds = enrollments.flatMap((e) =>
      e.course.modules.flatMap((m) => m.classes.map((c) => c.id)),
    )
  
    const completed = await this.prisma.classProgress.findMany({
      where: { userId, completed: true, classId: { in: allIds } },
      select: { classId: true },
    })
    const done = new Set(completed.map((p) => p.classId))
  
    const courses = enrollments.map((en) => {
      const c = en.course
      const totalModules = c.modules.length
  
      let modulesCompleted = 0
      let currentModuleTitle = c.modules[0]?.description || ''
  
      for (const m of c.modules) {
        const finished = m.classes.every((cls) => done.has(cls.id))
        if (finished) modulesCompleted++
        if (!finished && currentModuleTitle === c.modules[0]?.description)
          currentModuleTitle = m.description
      }
  
      const progress =
        totalModules === 0 ? 0 : Math.round((modulesCompleted * 100) / totalModules)
  
      return {
        userId,
        courseId: c.id,
        title: c.title,
        bannerUrl: c.bannerUrl || '',
        categoryName: c.category?.name || '',
        categoryColor: c.category?.colorHex || '#CCCCCC',
        enrollmentDate: en.enrolledAt,
        instructorName: `${c.instructor?.user?.firstName || ''} ${c.instructor?.user?.lastName || ''}`.trim(),
        totalModules,
        modulesCompleted,
        progressPercentage: progress,
        currentModuleTitle,
      }
    })
  
    return { userId, courses }
  }
  
}
