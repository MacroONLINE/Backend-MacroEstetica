import { Body, Controller, Get, Param, Post, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClassroomService } from './classroom.service';

@ApiTags('Classrooms')
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo Classroom' })
  @ApiResponse({ status: 201, description: 'Classroom creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la creación del classroom' })
  async createClassroom(@Body() body: any) {
    return this.classroomService.createClassroom(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un Classroom existente' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a actualizar' })
  @ApiResponse({ status: 200, description: 'Classroom actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Classroom no encontrado' })
  async updateClassroom(@Param('id') id: string, @Body() body: any) {
    return this.classroomService.updateClassroom(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un Classroom por ID' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a eliminar' })
  @ApiResponse({ status: 200, description: 'Classroom eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Classroom no encontrado' })
  async deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtiene todos los Classrooms que aún no han iniciado' })
  @ApiResponse({ status: 200, description: 'Lista de Classrooms futuros' })
  async getUpcomingClassrooms() {
    return this.classroomService.getUpcomingClassrooms();
  }

  @Get('live')
  @ApiOperation({ summary: 'Obtiene todos los Classrooms en vivo en este momento' })
  @ApiResponse({ status: 200, description: 'Lista de Classrooms en vivo' })
  @ApiResponse({ status: 404, description: 'No hay Classrooms en vivo en este momento' })
  async getLiveClassrooms() {
    const classrooms = await this.classroomService.getLiveClassrooms();
    if (!classrooms || classrooms.length === 0) {
      throw new NotFoundException('No hay Classrooms en vivo en este momento');
    }
    return classrooms;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un Classroom por su ID' })
  @ApiParam({ name: 'id', description: 'ID del Classroom a buscar' })
  @ApiResponse({ status: 200, description: 'Retorna el Classroom si existe' })
  @ApiResponse({ status: 404, description: 'Classroom no encontrado' })
  async getClassroomById(@Param('id') id: string) {
    const classroom = await this.classroomService.getClassroomById(id);
    if (!classroom) throw new NotFoundException('Classroom no encontrado');
    return classroom;
  }

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Agrega un orador (Instructor) a un Classroom' })
  @ApiParam({ name: 'id', description: 'ID del Classroom donde se agregará el orador' })
  @ApiResponse({ status: 200, description: 'Orador agregado correctamente' })
  @ApiResponse({ status: 404, description: 'Classroom no encontrado' })
  async addOrator(@Param('id') id: string, @Body() body: { instructorId: string }) {
    return this.classroomService.addOrator(id, body.instructorId);
  }

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Quita un orador (Instructor) de un Classroom' })
  @ApiParam({ name: 'id', description: 'ID del Classroom donde se quitará el orador' })
  @ApiResponse({ status: 200, description: 'Orador removido correctamente' })
  @ApiResponse({ status: 404, description: 'Classroom o Instructor no encontrado' })
  async removeOrator(@Param('id') id: string, @Body() body: { instructorId: string }) {
    return this.classroomService.removeOrator(id, body.instructorId);
  }
}
