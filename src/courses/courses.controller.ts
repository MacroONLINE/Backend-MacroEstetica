import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Target } from '@prisma/client';
import { CourseResponseDto } from './response-dto/course-response.dto';



@ApiTags('courses')
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
    return this.coursesService.createComment(createCommentDto);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
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

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get courses by category' })
  @ApiParam({ name: 'categoryId', description: 'The ID of the category' })
  @ApiResponse({ status: 200, description: 'List of courses retrieved.' })
  async getCoursesByCategory(@Param('categoryId') categoryId: string) {
    return this.coursesService.getCoursesByCategory(categoryId);
  }

  @Get('by-instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  @ApiParam({ name: 'instructorId', description: 'The ID of the instructor' })
  @ApiResponse({ status: 200, description: 'List of courses retrieved.' })
  async getCoursesByInstructor(@Param('instructorId') instructorId: string) {
    return this.coursesService.getCoursesByInstructor(instructorId);
  }

  @Get('by-target/:target')
  @ApiOperation({ summary: 'Get courses by target audience' })
  @ApiParam({ name: 'target', description: 'Target audience (e.g., MEDICO, ESTETICISTA)' })
  @ApiResponse({ status: 200, description: 'List of courses retrieved.' })
  async getCoursesByTarget(@Param('target') target: Target) {
    return this.coursesService.getCoursesByTarget(target);
  }
  
  @Get(':courseId/modules')
  @ApiOperation({ summary: 'Get all modules for a specific course' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course' })
  @ApiResponse({ status: 200, description: 'List of modules retrieved.' })
  async getModulesByCourseId(@Param('courseId') courseId: string) {
    return this.coursesService.getModulesByCourseId(courseId);
  }

  @Get('modules/:moduleId/classes')
  @ApiOperation({ summary: 'Get all classes for a specific module' })
  @ApiParam({ name: 'moduleId', description: 'The ID of the module' })
  @ApiResponse({ status: 200, description: 'List of classes retrieved.' })
  async getClassesByModuleId(@Param('moduleId') moduleId: string) {
    return this.coursesService.getClassesByModuleId(moduleId);
  }

  

  @Get(':courseId')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'courseId', description: 'The ID of the course' })
  @ApiResponse({ status: 200, type: CourseResponseDto, description: 'Course retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getCourseById(@Param('courseId') courseId: string): Promise<CourseResponseDto> {
    return this.coursesService.getCourseById(courseId);
  }
}