import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@ApiTags('instructors')
@Controller('instructors')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @ApiOperation({ summary: 'Crear un instructor' })
  @Post()
  async createInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    return this.instructorService.createInstructor(createInstructorDto);
  }

  @ApiOperation({ summary: 'Obtener todos los instructores' })
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

  @ApiOperation({ summary: 'Actualizar un instructor' })
  @Patch(':id')
  async updateInstructor(
    @Param('id') id: string,
    @Body() updateDto: UpdateInstructorDto,
  ) {
    return this.instructorService.updateInstructor(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar un instructor' })
  @Delete(':id')
  async deleteInstructor(@Param('id') id: string) {
    return this.instructorService.deleteInstructor(id);
  }

  @Post('convert/:userId')
@ApiOperation({ summary: 'Convertir un usuario en instructor (solo descripción)' })
@ApiParam({ name: 'userId', description: 'ID del usuario' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['description'],
    properties: {
      description: { type: 'string', example: 'Especialista en láser facial' },
    },
  },
})
async convertUserToInstructor(
  @Param('userId') userId: string,
  @Body('description') description: string,
) {
  return this.instructorService.convertUserToInstructor(userId, description)
}


}
