import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { Prisma } from '@prisma/client';

@ApiTags('instructors')
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @ApiOperation({ summary: 'Crear un instructor' })
  @Post()
  async createInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.createInstructor(createInstructorDto);
  }

  @ApiOperation({ summary: 'Obtener todos los instructores (opcional)' })
  @Get()
  async getAllInstructors() {
    return this.instructorService.getAllInstructors();
  }

  @ApiOperation({ summary: 'Obtener un instructor por ID' })
  @Get(':id')
  async getInstructorById(@Param('id') id: string) {
    return this.instructorService.getInstructorById(id);
  }

  @ApiOperation({ summary: 'Obtener instructores por categoría' })
  @Get('by-category/search')
  async getInstructorsByCategory(@Query('categoryId') categoryId: string) {
    return this.instructorService.getInstructorsByCategory(categoryId);
  }

  @ApiOperation({ summary: 'Obtener instructores por empresa' })
  @Get('by-empresa/search')
  async getInstructorsByEmpresa(@Query('empresaId') empresaId: string) {
    return this.instructorService.getInstructorsByEmpresa(empresaId);
  }

  @ApiOperation({ summary: 'Actualizar un instructor (opcional)' })
  @Patch(':id')
  async updateInstructor(@Param('id') id: string, @Body() data: Prisma.InstructorUpdateInput) {
    return this.instructorService.updateInstructor(id, data);
  }

  @ApiOperation({ summary: 'Eliminar un instructor (opcional)' })
  @Delete(':id')
  async deleteInstructor(@Param('id') id: string) {
    return this.instructorService.deleteInstructor(id);
  }
}
