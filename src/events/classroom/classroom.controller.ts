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
  import { ClassroomService } from './classroom.service';
  
  @Controller('classroom')
  export class ClassroomController {
    constructor(private readonly classroomService: ClassroomService) {}
  
    @Post()
    async createClassroom(@Body() body: any) {
      return this.classroomService.createClassroom(body);
    }
  
    @Get(':id')
    async getClassroomById(@Param('id') id: string) {
      const classroom = await this.classroomService.getClassroomById(id);
      if (!classroom) throw new NotFoundException('Classroom no encontrado');
      return classroom;
    }
  
    @Patch(':id')
    async updateClassroom(@Param('id') id: string, @Body() body: any) {
      return this.classroomService.updateClassroom(id, body);
    }
  
    @Delete(':id')
    async deleteClassroom(@Param('id') id: string) {
      return this.classroomService.deleteClassroom(id);
    }
  }
  