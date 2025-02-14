import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la creación del evento' })
  async createEvent(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }

  @Post(':eventId/register')
  @ApiOperation({ summary: 'Registra un usuario como asistente de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento a inscribir' })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito' })
  @ApiResponse({ status: 403, description: 'El usuario ya está inscrito o no se pudo inscribir' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async registerAttendee(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string },
  ) {
    const { userId } = body;
    const isRegistered = await this.eventsService.registerAttendee(eventId, userId);
    if (!isRegistered) {
      throw new ForbiddenException('El usuario ya está inscrito o no se pudo inscribir en este evento');
    }
    return { message: `Usuario ${userId} registrado con éxito en el evento ${eventId}` };
  }

  @Get('physical')
  @ApiOperation({ summary: 'Obtiene todos los eventos presenciales (con location física) sin importar la empresa' })
  @ApiResponse({ status: 200, description: 'Lista de eventos presenciales' })
  async getPhysicalEvents() {
    return this.eventsService.getPhysicalEvents();
  }

  @Get('physical/empresa/:empresaId')
  @ApiOperation({ summary: 'Obtiene todos los eventos presenciales de una empresa líder específica' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa líder' })
  @ApiResponse({ status: 200, description: 'Lista de eventos presenciales para la empresa indicada' })
  async getPhysicalEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getPhysicalEventsByEmpresa(empresaId);
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Obtiene todos los eventos de una empresa líder' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa líder' })
  @ApiResponse({ status: 200, description: 'Retorna la lista de eventos relacionados con la empresa líder' })
  async getEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getEventsByLeadingCompany(empresaId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Obtiene todos los eventos próximos a partir de la fecha/hora actual' })
  @ApiResponse({ status: 200, description: 'Lista de eventos próximos' })
  async getUpcomingEvents() {
    return this.eventsService.getUpcomingEvents();
  }

  @Get('upcoming/:year')
  @ApiOperation({
    summary: 'Obtiene todos los eventos futuros de un año específico',
    description: 'Si el año es el actual, se filtra desde hoy. Si es distinto, se filtra desde el 1 de enero de ese año.',
  })
  @ApiParam({
    name: 'year',
    required: true,
    description: 'Año para el cual se obtendrán los eventos futuros. Puede ser el año actual o uno futuro.',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Lista de eventos futuros para el año especificado' })
  @ApiResponse({ status: 404, description: 'No se encontraron eventos para el rango indicado' })
  async getUpcomingEventsByYear(@Param('year', ParseIntPipe) year: number) {
    const events = await this.eventsService.getUpcomingEventsByYear(year);
    if (!events || events.length === 0) {
      throw new NotFoundException(`No se encontraron eventos futuros para el año ${year}`);
    }
    return events;
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Obtiene un evento por su ID' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Retorna el evento si se encuentra' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getEventById(@Param('eventId') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  @Get(':eventId/streams-workshops')
  @ApiOperation({ summary: 'Obtiene los streams y workshops de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Retorna los streams y workshops asociados al evento' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getEventStreamsAndWorkshops(@Param('eventId') eventId: string) {
    const data = await this.eventsService.getStreamsAndWorkshopsByEvent(eventId);
    if (!data) throw new NotFoundException('Evento no encontrado');
    return data;
  }

  @Get('classrooms/live')
@ApiOperation({
  summary: 'Obtiene todos los classrooms que están en vivo en este momento',
  description: 'Devuelve una lista de classrooms que tienen una sesión en curso, basada en la fecha y hora actuales.',
})
@ApiResponse({
  status: 200,
  description: 'Lista de classrooms en vivo',
  schema: {
    type: 'array',
    items: {
      properties: {
        id: { type: 'string', example: 'classroom-001' },
        title: { type: 'string', example: 'Clase sobre Estética Avanzada' },
        description: { type: 'string', example: 'Técnicas innovadoras en estética' },
        price: { type: 'number', example: 500 },
        startDateTime: { type: 'string', format: 'date-time', example: '2025-03-01T14:00:00Z' },
        endDateTime: { type: 'string', format: 'date-time', example: '2025-03-01T16:00:00Z' },
        imageUrl: { type: 'string', example: 'https://res.cloudinary.com/example/image.jpg' },
        channelName: { type: 'string', example: 'estetica-avanzada' },
        createdAt: { type: 'string', format: 'date-time', example: '2025-02-06T21:13:28.937Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-02-06T21:13:28.937Z' },
        orators: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'string', example: 'instructor-004' },
              name: { type: 'string', example: 'Dr. Juan Pérez' },
              profession: { type: 'string', example: 'MEDICINA_ESTETICA' },
            },
          },
        },
        attendees: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'string', example: 'user-001' },
              firstName: { type: 'string', example: 'Carlos' },
              lastName: { type: 'string', example: 'Gómez' },
              email: { type: 'string', example: 'carlos@example.com' },
            },
          },
        },
      },
    },
  },
})
@ApiResponse({ status: 404, description: 'No hay classrooms en vivo en este momento' })
async getLiveClassrooms() {
  const classrooms = await this.eventsService.getLiveClassrooms();
  if (!classrooms || classrooms.length === 0) {
    throw new NotFoundException('No hay classrooms en vivo en este momento');
  }
  return classrooms;
}


}
