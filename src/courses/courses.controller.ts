// src/courses/courses.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'

import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { CreateModuleDto } from './dto/create-module.dto'
import { CreateClassDto } from './dto/create-class.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { ActiveCoursesDto } from './dto/course-card.dto/active-courses.dto'
import { Target, ReactionType } from '@prisma/client'

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /* ─────────────── CREACIÓN BÁSICA ─────────────── */

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto)
  }

  /* ─────────────── DASHBOARD CARD ─────────────── */

  @Get('user/:userId/active')
  @ApiOperation({ summary: 'Get active courses card info for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, type: ActiveCoursesDto })
  async getActiveCourses(@Param('userId') userId: string) {
    return this.coursesService.getActiveCoursesCardInfo(userId)
  }

  /* ─────────────── CREAR ASOCIADOS ─────────────── */

  @Post('modules')
  @ApiOperation({ summary: 'Create a new module for a course' })
  @ApiResponse({ status: 201, description: 'Module created successfully.' })
  async createModule(@Body() dto: CreateModuleDto) {
    return this.coursesService.createModule(dto)
  }

  @Post('classes')
  @ApiOperation({ summary: 'Create a new class for a module' })
  @ApiResponse({ status: 201, description: 'Class created successfully.' })
  async createClass(@Body() dto: CreateClassDto) {
    return this.coursesService.createClass(dto)
  }

  @Post('comments')
  @ApiOperation({ summary: 'Create a new comment for a class' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  async createComment(@Body() dto: CreateCommentDto) {
    return this.coursesService.createClassComment(dto)
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new course category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.coursesService.createCategory(dto)
  }

  /* ─────────────── LISTADOS (con liked opcional) ─────────────── */

  @Get()
  @ApiOperation({ summary: 'Get all courses (optionally marks liked courses)' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID → adds liked:boolean to each course' })
  async getAllCourses(@Query('userId') userId?: string) {
    return this.coursesService.getAllCourses(userId)
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured courses (optionally marks liked courses)' })
  @ApiQuery({ name: 'userId', required: false })
  async getFeaturedCourses(@Query('userId') userId?: string) {
    return this.coursesService.getFeaturedCourses(userId)
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get courses by category (optionally marks liked courses)' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'userId', required: false })
  async getCoursesByCategory(
    @Param('categoryId') categoryId: string,
    @Query('userId') userId?: string,
  ) {
    return this.coursesService.getCoursesByCategory(categoryId, userId)
  }

  @Get('by-instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor (optionally marks liked courses)' })
  @ApiParam({ name: 'instructorId', description: 'Instructor ID' })
  @ApiQuery({ name: 'userId', required: false })
  async getCoursesByInstructor(
    @Param('instructorId') instructorId: string,
    @Query('userId') userId?: string,
  ) {
    return this.coursesService.getCoursesByInstructor(instructorId, userId)
  }

  @Get('by-target/:target')
  @ApiOperation({ summary: 'Get courses by target (optionally marks liked courses)' })
  @ApiParam({ name: 'target', description: 'MEDICO | COSMETOLOGO' })
  @ApiQuery({ name: 'userId', required: false })
  async getCoursesByTarget(
    @Param('target') target: Target,
    @Query('userId') userId?: string,
  ) {
    return this.coursesService.getCoursesByTarget(target, userId)
  }

  /* ─────────────── REACCIONES ─────────────── */

  @Post(':courseId/user/:userId/react')
  @ApiOperation({ summary: 'Toggle like/dislike for a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['type'],
      properties: {
        type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' },
      },
    },
  })
  async reactToCourse(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
    @Body('type') type: ReactionType,
  ) {
    return this.coursesService.toggleCourseReaction(
      userId,
      courseId,
      type || ReactionType.LIKE,
    )
  }

  /* ─────────────── PROGRESO & MATRÍCULA ─────────────── */

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get courses enrolled by a user with progress' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserCourses(@Param('userId') userId: string) {
    return this.coursesService.getUserCourses(userId)
  }

  @Get('user/:userId/course/:courseId/progress')
  @ApiOperation({ summary: 'Get user progress in a specific course' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async getUserCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.coursesService.getUserCourseProgress(userId, courseId)
  }

  @Get(':courseId/user/:userId/enrolled')
  @ApiOperation({ summary: 'Check if a user is enrolled in a course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async isUserEnrolled(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.isUserEnrolled(courseId, userId)
  }

  @Get('module/:moduleId/user/:userId/progress')
  @ApiOperation({ summary: 'Get classes completed by a user in a module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserModuleProgress(
    @Param('moduleId') moduleId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.getUserModuleProgress(moduleId, userId)
  }

  @Post('class/:classId/user/:userId/complete')
  @ApiOperation({ summary: 'Mark a class as completed for a user' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @HttpCode(HttpStatus.OK)
  async markClassAsCompleted(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.markClassAsCompleted(userId, classId)
  }

  /* ─────────────── WISHLIST ─────────────── */

  @Get('user/:userId/wishlist')
  @ApiOperation({ summary: 'Cursos a los que el usuario dio like (wishlist)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getCourseWishlist(@Param('userId') userId: string) {
    return this.coursesService.getLikedCourses(userId)
  }

  /* ─────────────── DETALLE GENÉRICO ─────────────── */

  
@Get(':courseId')
@ApiOperation({ summary: 'Get a course by ID' })
@ApiParam({ name: 'courseId', description: 'Course ID' })
@ApiQuery({ name: 'userId', required: false, description: 'User ID to mark liked' })
@ApiResponse({ status: 200, description: 'Course details returned, with optional liked flag' })
async getCourseById(
  @Param('courseId') courseId: string,
  @Query('userId') userId?: string,
) {
  return this.coursesService.getCourseById(courseId, userId)
}
}
