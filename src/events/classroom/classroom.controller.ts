import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClassroomService } from './classroom.service';

@ApiTags('Classrooms')
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo Classroom' })
  @ApiResponse({
    status: 201,
    description: 'Classroom creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para la creación del classroom',
  })
  async createClassroom(@Body() body: any) {
    return this.classroomService.createClassroom(body);
  }



  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un Classroom existente' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'Classroom actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom no encontrado',
  })
  async updateClassroom(@Param('id') id: string, @Body() body: any) {
    return this.classroomService.updateClassroom(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un Classroom por ID' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Classroom eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom no encontrado',
  })
  async deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }

  @Get(':id/upcoming-workshops')
  @ApiOperation({ summary: 'Obtiene todos los Workshops próximos de un Classroom' })
  @ApiParam({ name: 'id', description: 'ID del Classroom' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Workshops próximos',
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom no encontrado o sin workshops próximos',
  })
  async getUpcomingWorkshopsForClassroom(@Param('id') classroomId: string) {
    const workshops =
      await this.classroomService.getUpcomingWorkshopsForClassroom(classroomId);
    return workshops;
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtiene todos los Classrooms con Workshops próximos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Classrooms con al menos un Workshop futuro',
  })
  async getUpcomingClassrooms() {
    return this.classroomService.getUpcomingClassrooms();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un Classroom por su ID' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a buscar' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el Classroom si existe',
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom no encontrado',
  })
  async getClassroomById(@Param('id') id: string) {
    const classroom = await this.classroomService.getClassroomById(id);
    if (!classroom) throw new NotFoundException('Classroom no encontrado');
    return classroom;
  }
}
