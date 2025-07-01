// src/classroom/classroom.controller.ts
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClassroomService } from './classroom.service';

@ApiTags('Classrooms')
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  /* ------------------------------------------------------------------------ */
  /* CREATE ----------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Post()
  @ApiOperation({ summary: 'Create a new classroom' })
  @ApiBody({
    description: 'JSON payload containing basic classroom data',
    schema: {
      example: {
        title: 'Advanced Aesthetics Marathon',
        description: 'Full day of hands-on aesthetic procedures.',
        price: 49.99,
        startDateTime: '2025-03-20T15:00:00Z',
        endDateTime: '2025-03-20T21:00:00Z',
        imageUrl: 'https://cdn.example.com/img/banner.jpg',
        channelName: 'classroom-aesthetics-001',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Classroom successfully created',
    schema: {
      example: {
        id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
        title: 'Advanced Aesthetics Marathon',
        description: 'Full day of hands-on aesthetic procedures.',
        price: 49.99,
        startDateTime: '2025-03-20T15:00:00.000Z',
        endDateTime: '2025-03-20T21:00:00.000Z',
        imageUrl: 'https://cdn.example.com/img/banner.jpg',
        channelName: 'classroom-aesthetics-001',
        createdAt: '2025-01-18T09:55:34.000Z',
        updatedAt: '2025-01-18T09:55:34.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data supplied for classroom creation',
  })
  async createClassroom(@Body() body: any) {
    return this.classroomService.createClassroom(body);
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE ----------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing classroom' })
  @ApiParam({
    name: 'id',
    description: 'Classroom ID to update',
    example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
  })
  @ApiBody({
    description: 'Fields to update (partial payload allowed)',
    schema: {
      example: {
        title: 'Advanced Aesthetics Marathon – Updated',
        description: 'Updated short description',
        price: 59.99,
        startDateTime: '2025-03-20T16:00:00Z',
        endDateTime: '2025-03-20T22:00:00Z',
        imageUrl: 'https://cdn.example.com/img/banner_v2.jpg',
        channelName: 'classroom-aesthetics-001',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Classroom successfully updated',
    schema: {
      example: {
        id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
        title: 'Advanced Aesthetics Marathon – Updated',
        description: 'Updated short description',
        price: 59.99,
        startDateTime: '2025-03-20T16:00:00.000Z',
        endDateTime: '2025-03-20T22:00:00.000Z',
        imageUrl: 'https://cdn.example.com/img/banner_v2.jpg',
        channelName: 'classroom-aesthetics-001',
        orators: [],
        attendees: [],
        enrollments: [],
        isLive: false,
        createdAt: '2025-01-18T09:55:34.000Z',
        updatedAt: '2025-01-18T10:30:41.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async updateClassroom(@Param('id') id: string, @Body() body: any) {
    return this.classroomService.updateClassroom(id, body);
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE ----------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a classroom by ID' })
  @ApiParam({
    name: 'id',
    description: 'Classroom ID to delete',
    example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
  })
  @ApiResponse({
    status: 200,
    description: 'Classroom successfully deleted',
    schema: { example: { message: 'Classroom deleted successfully' } },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }

  /* ------------------------------------------------------------------------ */
  /* UPCOMING ---------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Get('upcoming')
  @ApiOperation({ summary: 'List all classrooms that have not started yet' })
  @ApiResponse({
    status: 200,
    description: 'Array of upcoming classrooms',
    schema: {
      example: [
        {
          id: 'cls_upcoming_001',
          title: 'Laser Physics 101',
          startDateTime: '2025-04-01T14:00:00.000Z',
          endDateTime: '2025-04-01T18:00:00.000Z',
          isLive: false,
        },
      ],
    },
  })
  async getUpcomingClassrooms() {
    return this.classroomService.getUpcomingClassrooms();
  }

  /* ------------------------------------------------------------------------ */
  /* LIVE ------------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Get('live')
  @ApiOperation({ summary: 'List all classrooms currently live' })
  @ApiResponse({
    status: 200,
    description: 'Array of live classrooms',
    schema: {
      example: [
        {
          id: 'cls_live_001',
          title: 'Dermatology Morning Session',
          startDateTime: '2025-01-18T08:00:00.000Z',
          endDateTime: '2025-01-18T12:00:00.000Z',
          isLive: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No live classrooms at this moment',
  })
  async getLiveClassrooms() {
    const classrooms = await this.classroomService.getLiveClassrooms();
    if (!classrooms || classrooms.length === 0) {
      throw new NotFoundException('There are no live classrooms at this moment');
    }
    return classrooms;
  }

  /* ------------------------------------------------------------------------ */
  /* GET BY ID -------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a classroom by ID' })
  @ApiParam({
    name: 'id',
    description: 'Classroom ID to fetch',
    example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
  })
  @ApiResponse({
    status: 200,
    description: 'Classroom detail',
    schema: {
      example: {
        id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
        title: 'Advanced Aesthetics Marathon',
        description: 'Full day of hands-on aesthetic procedures.',
        price: 49.99,
        startDateTime: '2025-03-20T15:00:00.000Z',
        endDateTime: '2025-03-20T21:00:00.000Z',
        isLive: false,
        orators: [],
        attendees: [],
        enrollments: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async getClassroomById(@Param('id') id: string) {
    const classroom = await this.classroomService.getClassroomById(id);
    if (!classroom)
      throw new NotFoundException('Classroom not found');
    return classroom;
  }

  /* ------------------------------------------------------------------------ */
  /* ADD ORATOR ------------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Add an instructor (orator) to a classroom' })
  @ApiParam({
    name: 'id',
    description: 'Classroom ID to attach the instructor to',
    example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
  })
  @ApiBody({
    schema: {
      description: 'Payload containing the instructor ID',
      example: { instructorId: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Instructor successfully linked to classroom',
    schema: {
      example: {
        id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
        orators: [{ id: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH', name: 'Dr. Jane Doe' }],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async addOrator(
    @Param('id') id: string,
    @Body() body: { instructorId: string },
  ) {
    return this.classroomService.addOrator(id, body.instructorId);
  }

  /* ------------------------------------------------------------------------ */
  /* REMOVE ORATOR ---------------------------------------------------------- */
  /* ------------------------------------------------------------------------ */

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Remove an instructor (orator) from a classroom' })
  @ApiParam({
    name: 'id',
    description: 'Classroom ID to detach the instructor from',
    example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
  })
  @ApiBody({
    schema: {
      description: 'Payload containing the instructor ID',
      example: { instructorId: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Instructor successfully removed from classroom',
    schema: {
      example: {
        id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
        orators: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom or instructor not found' })
  async removeOrator(
    @Param('id') id: string,
    @Body() body: { instructorId: string },
  ) {
    return this.classroomService.removeOrator(id, body.instructorId);
  }
}
