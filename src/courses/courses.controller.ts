// src/courses/courses.controller.ts
import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses with modules and classes' })
  @ApiResponse({ status: 200, description: 'List of courses' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get course by ID with modules, classes, resources' })
  @ApiParam({ name: 'courseId', example: 'abc123', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course found' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async getCourseById(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseById(courseId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all courses a user is enrolled in, with progress info' })
  @ApiParam({ name: 'userId', example: 'user-001', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of user courses with progress' })
  async getUserCourses(@Param('userId') userId: string) {
    return this.coursesService.getUserCourses(userId);
  }

  @Get('user/:userId/course/:courseId/progress')
  @ApiOperation({ summary: 'Get user progress for a specific course' })
  @ApiParam({ name: 'userId', example: 'user-001' })
  @ApiParam({ name: 'courseId', example: 'abc123' })
  @ApiResponse({ status: 200, description: 'Course progress returned' })
  @ApiResponse({ status: 404, description: 'User not enrolled or course not found' })
  async getUserCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string
  ) {
    return this.coursesService.getUserCourseProgress(userId, courseId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get class by ID with resources' })
  @ApiParam({ name: 'classId', example: 'class-001', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async getClassById(@Param('classId') classId: string) {
    return this.coursesService.getClassById(classId);
  }
}
