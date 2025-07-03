// src/classroom/classroom.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator'
import { ClassroomService } from './classroom.service'

class CreateClassroomDto {
  @IsString() title: string
  @IsString() description: string
  @IsNumber() price: number
  @IsDateString() startDateTime: string
  @IsDateString() endDateTime: string
  @IsOptional() @IsString() imageUrl?: string
  @IsOptional() @IsString() channelName?: string
  @IsOptional() @IsArray() @ArrayUnique() categoriesIds?: string[]     // profesión IDs
  @IsOptional() @IsArray() @ArrayUnique() oratorIds?: string[]        // instructor IDs
  @IsOptional() @IsArray() @ArrayUnique() attendeeIds?: string[]      // user IDs
}

class UpdateClassroomDto extends CreateClassroomDto {}

class OratorDto {
  @IsString() instructorId: string
}

@ApiTags('Classrooms')
@Controller('classroom')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  /* --------------------------------------------------------------------- */
  /* CREATE ---------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */

  @Post()
  @ApiOperation({ summary: 'Create classroom' })
  @ApiBody({ type: CreateClassroomDto })
  @ApiResponse({
    status: 201,
    description: 'Created classroom (IDs only)',
    schema: {
      example: {
        id: 'cls_001',
        title: 'Botulinum Toxin Masterclass',
        description: 'Hands-on training with live patients',
        price: 120,
        startDateTime: '2025-06-10T14:00:00.000Z',
        endDateTime: '2025-06-10T17:00:00.000Z',
        imageUrl: 'https://cdn.example.com/classrooms/btx.jpg',
        channelName: 'classroom-btx-001',
        categoriesIds: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
        oratorIds: ['instr_001'],
        attendeeIds: ['user_001'],
        isLive: false,
        createdAt: '2025-05-01T09:00:00.000Z',
        updatedAt: '2025-05-01T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  create(@Body() dto: CreateClassroomDto) {
    return this.classroomService.createClassroom(dto)
  }

  /* --------------------------------------------------------------------- */
  /* UPDATE ---------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */

  @Patch(':id')
  @ApiOperation({ summary: 'Update classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({ type: UpdateClassroomDto })
  @ApiResponse({
    status: 200,
    description: 'Updated classroom (IDs only)',
    schema: {
      example: {
        id: 'cls_001',
        title: 'Masterclass – Updated',
        description: 'Extended Q&A',
        price: 150,
        startDateTime: '2025-06-10T15:00:00.000Z',
        endDateTime: '2025-06-10T18:00:00.000Z',
        categoriesIds: ['DERMATOLOGIA'],
        oratorIds: ['instr_001', 'instr_002'],
        attendeeIds: [],
        isLive: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  update(@Param('id') id: string, @Body() dto: UpdateClassroomDto) {
    return this.classroomService.updateClassroom(id, dto)
  }

  /* --------------------------------------------------------------------- */
  /* DELETE ---------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */

  @Delete(':id')
  @ApiOperation({ summary: 'Delete classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Classroom eliminado correctamente' } },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  remove(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id)
  }

  /* --------------------------------------------------------------------- */
  /* UPCOMING / LIVE ------------------------------------------------------ */
  /* --------------------------------------------------------------------- */

  @Get('upcoming')
  @ApiOperation({ summary: 'Upcoming classrooms' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'cls_002',
          title: 'Laser Safety Basics',
          startDateTime: '2025-07-01T14:00:00.000Z',
          endDateTime: '2025-07-01T17:00:00.000Z',
          isLive: false,
        },
      ],
    },
  })
  upcoming() {
    return this.classroomService.getUpcomingClassrooms()
  }

  @Get('live')
  @ApiOperation({ summary: 'Live classrooms' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'cls_003',
          title: 'Dermatologic Suturing Techniques',
          startDateTime: '2025-05-20T08:00:00.000Z',
          endDateTime: '2025-05-20T11:00:00.000Z',
          isLive: true,
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'No live classrooms' })
  async live() {
    const list = await this.classroomService.getLiveClassrooms()
    if (list.length === 0)
      throw new NotFoundException('No live classrooms at this moment')
    return list
  }

  /* --------------------------------------------------------------------- */
  /* DETAIL ---------------------------------------------------------------- */
  /* --------------------------------------------------------------------- */

  @Get(':id')
  @ApiOperation({ summary: 'Get classroom detail (IDs only)' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        title: 'Botulinum Toxin Masterclass',
        description: 'Hands-on training with live patients',
        price: 120,
        startDateTime: '2025-06-10T14:00:00.000Z',
        endDateTime: '2025-06-10T17:00:00.000Z',
        categoriesIds: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
        oratorIds: ['instr_001'],
        attendeeIds: ['user_001'],
        isLive: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  findOne(@Param('id') id: string) {
    return this.classroomService.getClassroomById(id)
  }

  /* --------------------------------------------------------------------- */
  /* ORATOR MANAGEMENT ---------------------------------------------------- */
  /* --------------------------------------------------------------------- */

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Add instructor to classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({ type: OratorDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        oratorIds: ['instr_001', 'instr_002'],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom or instructor not found' })
  addOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.classroomService.addOrator(id, dto.instructorId)
  }

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Remove instructor from classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({ type: OratorDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        oratorIds: ['instr_001'],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom or instructor not found' })
  removeOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.classroomService.removeOrator(id, dto.instructorId)
  }
}
