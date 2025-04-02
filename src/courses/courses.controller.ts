import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Target } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Post('modules')
  @ApiOperation({ summary: 'Create a new module for a course' })
  @ApiResponse({ status: 201, description: 'Module created successfully.' })
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(createModuleDto);
  }

  @Post('classes')
  @ApiOperation({ summary: 'Create a new class for a module' })
  @ApiResponse({ status: 201, description: 'Class created successfully.' })
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.coursesService.createClass(createClassDto);
  }

  @Post('comments')
  @ApiOperation({ summary: 'Create a new comment for a class' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    // Internamente llamará a createClassComment
    return this.coursesService.createClassComment(createCommentDto);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new course category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.coursesService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with full details' })
  @ApiResponse({ status: 200, description: 'List of all courses.' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured courses' })
  @ApiResponse({ status: 200, description: 'List of featured courses.' })
  async getFeaturedCourses() {
    return this.coursesService.getFeaturedCourses();
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get courses by category ID' })
  @ApiParam({ name: 'categoryId', description: 'ID of the category' })
  @ApiResponse({ status: 200, description: 'List of courses by category.' })
  async getCoursesByCategory(@Param('categoryId') categoryId: string) {
    return this.coursesService.getCoursesByCategory(categoryId);
  }

  @Get('by-instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor ID' })
  @ApiParam({ name: 'instructorId', description: 'ID of the instructor' })
  @ApiResponse({ status: 200, description: 'List of courses by instructor.' })
  async getCoursesByInstructor(@Param('instructorId') instructorId: string) {
    return this.coursesService.getCoursesByInstructor(instructorId);
  }

  @Get('by-target/:target')
  @ApiOperation({ summary: 'Get courses by target audience' })
  @ApiParam({
    name: 'target',
    description: 'Target audience (e.g., MEDICO, COSMETOLOGO)',
  })
  @ApiResponse({ status: 200, description: 'List of courses by target audience.' })
  async getCoursesByTarget(@Param('target') target: Target) {
    return this.coursesService.getCoursesByTarget(target);
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiResponse({ status: 200, description: 'Course details returned.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getCourseById(@Param('courseId') courseId: string) {
    return this.coursesService.getCourseById(courseId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get courses enrolled by a user with progress' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User enrolled courses with progress.' })
  async getUserCourses(@Param('userId') userId: string) {
    return this.coursesService.getUserCourses(userId);
  }

  @Get('user/:userId/course/:courseId/progress')
  @ApiOperation({ summary: 'Get user progress in a specific course' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'User progress returned.' })
  @ApiResponse({ status: 404, description: 'User or course not found.' })
  async getUserCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.coursesService.getUserCourseProgress(userId, courseId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get class details by ID' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class details returned.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  async getClassById(@Param('classId') classId: string) {
    return this.coursesService.getClassById(classId);
  }

  @Get(':courseId/user/:userId/enrolled')
  @ApiOperation({ summary: 'Check if a user is enrolled in a specific course' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Enrollment status returned.' })
  @ApiResponse({ status: 404, description: 'Course or user not found.' })
  async isUserEnrolled(
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.isUserEnrolled(courseId, userId);
  }

  @Get('modules/course/:courseId')
  @ApiOperation({ summary: 'Get modules by course ID' })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Modules of the specified course returned.' })
  async getModulesByCourse(@Param('courseId') courseId: string) {
    return this.coursesService.getModulesByCourse(courseId);
  }

  @Get('module/:moduleId')
  @ApiOperation({ summary: 'Get details of a specific module' })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiResponse({ status: 200, description: 'Module details returned.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  async getModuleById(@Param('moduleId') moduleId: string) {
    return this.coursesService.getModuleById(moduleId);
  }

  @Get('module/:moduleId/user/:userId/progress')
  @ApiOperation({
    summary: 'Get classes approved by a user in a specific module',
  })
  @ApiParam({ name: 'moduleId', description: 'Module ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User class progress in the module returned.',
  })
  async getUserModuleProgress(
    @Param('moduleId') moduleId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.getUserModuleProgress(moduleId, userId);
  }

  @Post('class/:classId/user/:userId/complete')
  @ApiOperation({ summary: 'Mark a class as completed for a specific user' })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @HttpCode(HttpStatus.OK)
  async markClassAsCompleted(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
  ) {
    return this.coursesService.markClassAsCompleted(userId, classId);
  }

}
