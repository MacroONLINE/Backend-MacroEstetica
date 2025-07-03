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

/* ---------------------------- DTOs ---------------------------- */

class CreateClassroomDto {
  @IsString() title: string
  @IsString() description: string
  @IsNumber() price: number

  @Type(() => Date)
  @IsDate()
  startDateTime: Date

  @Type(() => Date)
  @IsDate()
  endDateTime: Date

  @IsOptional()
  @IsString()
  channelName?: string

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum($Enums.Profession, { each: true })
  categories?: $Enums.Profession[]

  /** Cadena separada por comas con todos los oradores */
  @IsOptional()
  @IsString()
  oratorNames?: string

  /** IDs de usuarios que asistirán ya inscritos */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  attendeeIds?: string[]
}

class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}

/* -------------------------- Controller ------------------------ */

@ApiTags('Classrooms')
@Controller('classroom')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  /* ---------- CREATE ---------- */

  @Post()
  @ApiOperation({ summary: 'Crear un aula (classroom)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    description:
      'Todos los campos *startDateTime* y *endDateTime* deben ir en ISO-8601. ' +
      '`oratorNames` acepta una lista de nombres separada por comas.',
    schema: {
      type: 'object',
      required: [
        'title',
        'description',
        'price',
        'startDateTime',
        'endDateTime',
      ],
      properties: {
        title: { type: 'string', example: 'Botox Masterclass' },
        description: { type: 'string', example: 'Hands-on training' },
        price: { type: 'number', example: 120 },
        startDateTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-10T14:00:00.000Z',
        },
        endDateTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-10T17:00:00.000Z',
        },
        channelName: {
          type: 'string',
          example: 'classroom-btx-001',
        },
        categories: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values($Enums.Profession),
          },
          example: ['DERMATOLOGIA'],
        },
        oratorNames: {
          type: 'string',
          example: 'Dra. Gómez, Dr. Salazar',
        },
        attendeeIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['user_001', 'user_002'],
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Aula creada',
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
        oratorNames: 'Dra. Gómez, Dr. Salazar',
        attendeeIds: ['user_001', 'user_002'],
        imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
        isLive: false,
      },
    },
  })
  create(@Body() dto: CreateClassroomDto, @UploadedFile() image?: Express.Multer.File) {
    return this.service.createClassroom({ ...dto, image })
  }

  /* ---------- UPDATE ---------- */

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un aula' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({
    name: 'id',
    description: 'ID del aula',
    example: 'cls_001',
  })
  @ApiBody({
    description:
      'Envia solo los campos que deseas cambiar. ' +
      'Las categorías reemplazan completamente las anteriores si se envían.',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Nuevo título' },
        description: { type: 'string', example: 'Descripción actualizada' },
        price: { type: 'number', example: 150 },
        startDateTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-10T15:00:00.000Z',
        },
        endDateTime: {
          type: 'string',
          format: 'date-time',
          example: '2025-06-10T18:00:00.000Z',
        },
        channelName: { type: 'string', example: 'classroom-btx-002' },
        categories: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values($Enums.Profession),
          },
          example: ['MEDICINA_ESTETICA'],
        },
        oratorNames: {
          type: 'string',
          example: 'Dr. Salazar, Dra. Jiménez',
        },
        attendeeIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['user_003'],
        },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Aula actualizada',
    schema: {
      example: {
        id: 'cls_001',
        title: 'Nuevo título',
        categories: ['MEDICINA_ESTETICA'],
        oratorNames: 'Dr. Salazar, Dra. Jiménez',
        attendeeIds: ['user_003'],
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

  /* ---------- DELETE ---------- */

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'cls_001' })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Classroom eliminado correctamente' } },
  })
  remove(@Param('id') id: string) {
    return this.service.deleteClassroom(id)
  }

  /* ---------- UPCOMING ---------- */

  @Get('upcoming')
  @ApiOperation({ summary: 'Listar aulas futuras (aún no inician)' })
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

  /* ---------- LIVE ---------- */

  @Get('live')
  @ApiOperation({ summary: 'Listar aulas en vivo' })
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
  @ApiResponse({ status: 404, description: 'No hay aulas en vivo' })
  async live() {
    const list = await this.service.getLiveClassrooms()
    if (list.length === 0)
      throw new NotFoundException('No hay aulas en vivo en este momento')
    return list
  }

  /* ---------- DETAIL ---------- */

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un aula' })
  @ApiParam({ name: 'id', description: 'ID del aula', example: 'cls_001' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'cls_001',
        title: 'Botox Masterclass',
        price: 120,
        oratorNames: 'Dra. Gómez, Dr. Salazar',
        attendeeIds: ['user_001', 'user_002'],
        categories: ['DERMATOLOGIA'],
        isLive: false,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Aula no encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.getClassroomById(id)
  }
}
