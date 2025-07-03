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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { ClassroomService } from './classroom.service'
import { $Enums } from '@prisma/client'

class CreateClassroomDto {
  @IsString() title: string
  @IsString() description: string
  @IsNumber() price: number
  @Type(() => Date) @IsDate() startDateTime: Date
  @Type(() => Date) @IsDate() endDateTime: Date
  @IsOptional() @IsString() channelName?: string
  @IsOptional() @IsArray() @ArrayUnique() @IsEnum($Enums.Profession, { each: true }) categories?: $Enums.Profession[]
  @IsOptional() @IsArray() @ArrayUnique() oratorIds?: string[]
  @IsOptional() @IsArray() @ArrayUnique() attendeeIds?: string[]
}

class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}

class OratorDto { @IsString() instructorId: string }

@ApiTags('Classrooms')
@Controller('classroom')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  @Post()
  @ApiOperation({ summary: 'Create classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'price', 'startDateTime', 'endDateTime'],
      properties: {
        title: { type: 'string', example: 'Botox Masterclass' },
        description: { type: 'string', example: 'Hands-on training' },
        price: { type: 'number', example: 120 },
        startDateTime: { type: 'string', format: 'date-time', example: '2025-06-10T14:00:00.000Z' },
        endDateTime: { type: 'string', format: 'date-time', example: '2025-06-10T17:00:00.000Z' },
        channelName: { type: 'string', example: 'classroom-btx-001' },
        categories: { type: 'array', items: { type: 'string', enum: Object.values($Enums.Profession) }, example: ['DERMATOLOGIA'] },
        oratorIds: { type: 'array', items: { type: 'string' }, example: ['instr_001'] },
        attendeeIds: { type: 'array', items: { type: 'string' }, example: ['user_001'] },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        id: 'cls_001',
        title: 'Botox Masterclass',
        description: 'Hands-on training',
        price: 120,
        startDateTime: '2025-06-10T14:00:00.000Z',
        endDateTime: '2025-06-10T17:00:00.000Z',
        channelName: 'classroom-btx-001',
        categories: ['DERMATOLOGIA'],
        oratorIds: ['instr_001'],
        attendeeIds: ['user_001'],
        imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
        isLive: false,
      },
    },
  })
  create(@Body() dto: CreateClassroomDto, @UploadedFile() image?: Express.Multer.File) {
    return this.service.createClassroom({ ...dto, image })
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'New title' },
        description: { type: 'string', example: 'New description' },
        price: { type: 'number', example: 150 },
        startDateTime: { type: 'string', format: 'date-time', example: '2025-06-10T15:00:00.000Z' },
        endDateTime: { type: 'string', format: 'date-time', example: '2025-06-10T18:00:00.000Z' },
        channelName: { type: 'string', example: 'classroom-btx-001' },
        categories: { type: 'array', items: { type: 'string', enum: Object.values($Enums.Profession) }, example: ['DERMATOLOGIA'] },
        oratorIds: { type: 'array', items: { type: 'string' }, example: ['instr_001', 'instr_002'] },
        attendeeIds: { type: 'array', items: { type: 'string' }, example: [] },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        title: 'New title',
        categories: ['DERMATOLOGIA'],
        oratorIds: ['instr_001', 'instr_002'],
        attendeeIds: [],
        isLive: false,
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClassroomDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.updateClassroom(id, { ...dto, image })
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiResponse({ status: 200, schema: { example: { message: 'Classroom eliminado correctamente' } } })
  remove(@Param('id') id: string) {
    return this.service.deleteClassroom(id)
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Upcoming classrooms' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'cls_002',
          title: 'Laser Basics',
          startDateTime: '2025-07-01T14:00:00.000Z',
          endDateTime: '2025-07-01T17:00:00.000Z',
          isLive: false,
        },
      ],
    },
  })
  upcoming() {
    return this.service.getUpcomingClassrooms()
  }

  @Get('live')
  @ApiOperation({ summary: 'Live classrooms' })
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: 'cls_003',
          title: 'Derm Sutures',
          startDateTime: '2025-05-20T08:00:00.000Z',
          endDateTime: '2025-05-20T11:00:00.000Z',
          isLive: true,
        },
      ],
    },
  })
  @ApiResponse({ status: 404, description: 'No live classrooms' })
  async live() {
    const list = await this.service.getLiveClassrooms()
    if (list.length === 0) throw new NotFoundException('No live classrooms at this moment')
    return list
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get classroom detail' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        title: 'Botox Masterclass',
        price: 120,
        oratorIds: ['instr_001'],
        attendeeIds: ['user_001'],
        categories: ['DERMATOLOGIA'],
        isLive: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  findOne(@Param('id') id: string) {
    return this.service.getClassroomById(id)
  }

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Add instructor to classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['instructorId'],
      properties: { instructorId: { type: 'string', example: 'instr_002' } },
    },
  })
  @ApiResponse({
    status: 200,
    schema: { example: { id: 'cls_001', oratorIds: ['instr_001', 'instr_002'] } },
  })
  addOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.addOrator(id, dto.instructorId)
  }

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Remove instructor from classroom' })
  @ApiParam({ name: 'id', description: 'Classroom ID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['instructorId'],
      properties: { instructorId: { type: 'string', example: 'instr_002' } },
    },
  })
  @ApiResponse({
    status: 200,
    schema: { example: { id: 'cls_001', oratorIds: ['instr_001'] } },
  })
  removeOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.removeOrator(id, dto.instructorId)
  }
}
