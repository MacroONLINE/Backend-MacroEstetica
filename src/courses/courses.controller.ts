import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Crear un curso
  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  // Crear un módulo
  @Post('modules')
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(createModuleDto);
  }

  // Crear una clase
  @Post('classes')
  async createClass(@Body() createClassDto: CreateClassDto) {
    return this.coursesService.createClass(createClassDto);
  }

  // Crear un comentario
  @Post('comments')
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.coursesService.createComment(createCommentDto);
  }

  // Crear una categoría
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.coursesService.createCategory(createCategoryDto);
  }

  // Obtener todos los cursos
  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  // Obtener cursos destacados
  @Get('featured')
  async getFeaturedCourses() {
    return this.coursesService.getFeaturedCourses();
  }

  // Obtener módulos por el ID del curso
  @Get(':courseId/modules')
  async getModulesByCourseId(@Param('courseId') courseId: string) {
    return this.coursesService.getModulesByCourseId(courseId);
  }

  // Obtener clases por el ID del módulo
  @Get('modules/:moduleId/classes')
  async getClassesByModuleId(@Param('moduleId') moduleId: string) {
    return this.coursesService.getClassesByModuleId(moduleId);
  }
}
