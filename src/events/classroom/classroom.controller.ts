// src/classroom/classroom.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ClassroomService } from './classroom.service'
import { CreateClassroomDto } from './dto/create-classroom.dto'
import { UpdateClassroomDto } from './dto/update-classroom.dto'
import { $Enums } from '@prisma/client'

class OratorDto {
  instructorId: string
}

@ApiTags('Classrooms')
@ApiExtraModels(CreateClassroomDto, UpdateClassroomDto, OratorDto)
@Controller('empresas/:empresaId/classrooms')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiBearerAuth()
export class ClassroomController {
  constructor(private readonly service: ClassroomService) {}

  /* ──────────────── CREAR ──────────────── */

  @Post()
  @ApiOperation({ summary: 'Crear classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiBody({
    description: 'Formulario multipart/form-data para crear un classroom',
    schema: {
      type: 'object',
      required: ['title', 'description', 'startDateTime', 'endDateTime'],
      properties: {
        title:          { type: 'string',  example: 'Masterclass Botox' },
        description:    { type: 'string',  example: 'Técnicas avanzadas de aplicación de toxina botulínica' },
        price:          { type: 'number',  example: 150 },
        startDateTime:  { type: 'string',  format: 'date-time', example: '2025-11-20T14:00:00Z' },
        endDateTime:    { type: 'string',  format: 'date-time', example: '2025-11-20T16:00:00Z' },
        channelName:    { type: 'string',  example: 'classroom-btx-001' },
        categories:     {
          type: 'array',
          items: { type: 'string', enum: Object.values($Enums.Profession) },
          example: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
        },
        oratorIds:      {
          type: 'array',
          items: { type: 'string' },
          example: ['instr_001', 'instr_002'],
        },
        image:          { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Classroom creado',
    schema: {
      example: {
        id: 'cls_001',
        title: 'Masterclass Botox',
        description: 'Técnicas avanzadas de aplicación de toxina botulínica',
        price: 150,
        startDateTime: '2025-11-20T14:00:00.000Z',
        endDateTime: '2025-11-20T16:00:00.000Z',
        channelName: 'classroom-btx-001',
        categories: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
        empresaId: 'comp_001',
        orators: [{ id: 'instr_001' }, { id: 'instr_002' }],
        attendees: [],
        enrollments: [],
        imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
        isLive: false,
        createdAt: '2025-10-01T10:00:00.000Z',
        updatedAt: '2025-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(
    @Param('empresaId') empresaId: string,
    @Body() dto: CreateClassroomDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.createClassroom(empresaId, dto, image)
  }

  /* ──────────────── ACTUALIZAR ──────────────── */

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar classroom' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', example: 'cls_001' })
  @ApiBody({
    description: 'Multipart/form-data para actualizar classroom (solo campos a modificar)',
    schema: {
      type: 'object',
      properties: {
        title:          { type: 'string',  example: 'Masterclass Botox Avanzado' },
        description:    { type: 'string',  example: 'Actualización de técnicas' },
        price:          { type: 'number',  example: 200 },
        startDateTime:  { type: 'string',  format: 'date-time', example: '2025-11-20T15:00:00Z' },
        endDateTime:    { type: 'string',  format: 'date-time', example: '2025-11-20T18:00:00Z' },
        channelName:    { type: 'string',  example: 'classroom-btx-adv' },
        categories:     {
          type: 'array',
          items: { type: 'string', enum: Object.values($Enums.Profession) },
          example: ['DERMATOLOGIA'],
        },
        oratorIds:      {
          type: 'array',
          items: { type: 'string' },
          example: ['instr_001'],
        },
        image:          { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ description: 'Classroom actualizado' })
  @ApiNotFoundResponse()
  update(
    @Param('empresaId') empresaId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClassroomDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.updateClassroom(id, empresaId, dto, image)
  }

  /* ──────────────── RESTO DE ENDPOINTS (sin cambios) ──────────────── */

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar classroom' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', example: 'cls_001' })
  @ApiOkResponse({ description: 'Classroom eliminado' })
  @ApiNotFoundResponse()
  remove(@Param('id') id: string) {
    return this.service.deleteClassroom(id)
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Próximos classrooms (todas las empresas)' })
  @ApiOkResponse({ description: 'Listado de próximos classrooms' })
  upcoming() {
    return this.service.getUpcomingClassrooms()
  }

  @Get('live')
  @ApiOperation({ summary: 'Classrooms en vivo (todas las empresas)' })
  @ApiOkResponse({ description: 'Listado de classrooms en vivo' })
  live() {
    return this.service.getLiveClassrooms()
  }

  @Get('orators')
  @ApiOperation({ summary: 'Instructores de la empresa' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiOkResponse({ description: 'Listado de instructores' })
  getOrators(@Param('empresaId') empresaId: string) {
    return this.service.getAllOrators(empresaId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de classroom' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', example: 'cls_001' })
  @ApiOkResponse({ description: 'Detalle del classroom' })
  @ApiNotFoundResponse()
  findOne(@Param('id') id: string) {
    return this.service.getClassroomById(id)
  }

  @Get()
  @ApiOperation({ summary: 'Listado de classrooms de la empresa' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiOkResponse({ description: 'Listado completo de classrooms' })
  findAllByEmpresa(@Param('empresaId') empresaId: string) {
    return this.service.getAllByEmpresa(empresaId)
  }

  @Patch(':id/add-orator')
  @ApiOperation({ summary: 'Agregar instructor' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', example: 'cls_001' })
  @ApiBody({ type: OratorDto })
  @ApiOkResponse({ description: 'Instructor agregado' })
  addOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.addOrator(id, dto.instructorId)
  }

  @Patch(':id/remove-orator')
  @ApiOperation({ summary: 'Quitar instructor' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'id', example: 'cls_001' })
  @ApiBody({ type: OratorDto })
  @ApiOkResponse({ description: 'Instructor quitado' })
  removeOrator(@Param('id') id: string, @Body() dto: OratorDto) {
    return this.service.removeOrator(id, dto.instructorId)
  }
}
