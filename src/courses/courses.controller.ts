import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CoursesFetchDto } from './dto/courses-fetch.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Post('modules')
  @ApiOperation({ summary: 'Create a new module for a course' })
  @ApiResponse({ status: 201, description: 'Module created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(createModuleDto);
  }

  @Post('classes')
  @ApiOperation({ summary: 'Create a new class for a module' })
  @ApiResponse({ status: 201, description: 'Class created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.coursesService.createClass(createClassDto);
  }

  @Post('comments')
  @ApiOperation({ summary: 'Create a new comment for a class' })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.coursesService.createComment(createCommentDto);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.coursesService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'List of courses retrieved.' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured courses' })
  @ApiResponse({ status: 200, description: 'List of featured courses retrieved.' })
  async getFeaturedCourses() {
    return this.coursesService.getFeaturedCourses();
  }

  @Get(':courseId/modules')
  @ApiOperation({ summary: 'Get all modules for a specific course' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course' })
  @ApiResponse({ status: 200, description: 'List of modules retrieved.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getModulesByCourseId(@Param('courseId') courseId: string) {
    return this.coursesService.getModulesByCourseId(courseId);
  }

  @Get('modules/:moduleId/classes')
  @ApiOperation({ summary: 'Get all classes for a specific module' })
  @ApiParam({ name: 'moduleId', description: 'The ID of the module' })
  @ApiResponse({ status: 200, description: 'List of classes retrieved.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  async getClassesByModuleId(@Param('moduleId') moduleId: string) {
    return this.coursesService.getClassesByModuleId(moduleId);
  }

  @Get('featured-fetch')
  @ApiOperation({ summary: 'Obtener cursos destacados' })
  @ApiResponse({ status: 200, description: 'Lista de cursos destacados', type: [CoursesFetchDto] })
  async getFeaturedCoursesFetch(): Promise<CoursesFetchDto[]> {
    return this.coursesService.getFeaturedCoursesFetch();
  }
}
