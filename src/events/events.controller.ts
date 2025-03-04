import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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
  async registerAttendee(@Param('eventId') eventId: string, @Body() body: { userId: string }) {
    const isRegistered = await this.eventsService.registerAttendee(eventId, body.userId);
    if (!isRegistered) {
      throw new ForbiddenException('El usuario ya está inscrito o no se pudo inscribir en este evento');
    }
    return { message: `Usuario ${body.userId} registrado con éxito en el evento ${eventId}` };
  }

  @Get('physical')
  @ApiOperation({ summary: 'Obtiene todos los eventos presenciales (con location física)' })
  @ApiResponse({ status: 200, description: 'Lista de eventos presenciales' })
  async getPhysicalEvents() {
    return this.eventsService.getPhysicalEvents();
  }

  @Get('physical/empresa/:empresaId')
  @ApiOperation({ summary: 'Obtiene todos los eventos presenciales de una empresa líder' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa líder' })
  @ApiResponse({ status: 200, description: 'Lista de eventos presenciales para la empresa indicada' })
  async getPhysicalEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getPhysicalEventsByEmpresa(empresaId);
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Obtiene todos los eventos de una empresa líder' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa líder' })
  @ApiResponse({ status: 200, description: 'Retorna la lista de eventos de la empresa líder' })
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
    description: 'Si el año es el actual, se filtra desde hoy; si es distinto, se filtra desde el 1 de enero de ese año.',
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

  @Get('live')
  @ApiOperation({ summary: 'Obtiene todos los eventos en vivo en este momento' })
  @ApiResponse({ status: 200, description: 'Lista de eventos en vivo' })
  @ApiResponse({ status: 404, description: 'No hay eventos en vivo en este momento' })
  async getLiveEvents() {
    const events = await this.eventsService.getLiveEvents();
    if (!events || events.length === 0) {
      throw new NotFoundException('No hay eventos en vivo en este momento');
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

  @Get(':id/is-enrolled/:userId/:type')
@ApiOperation({ summary: 'Verifica si un usuario está inscrito en un evento, aula, transmisión en vivo o taller' })
@ApiParam({ name: 'id', description: 'ID del evento, aula, transmisión o taller' })
@ApiParam({ name: 'userId', description: 'ID del usuario' })
@ApiParam({ name: 'type', description: 'Tipo de entidad: event, classroom, stream, workshop' })
@ApiResponse({ status: 200, description: 'true o false, dependiendo si el usuario está inscrito' })
async isUserEnrolled(
  @Param('id') id: string,
  @Param('userId') userId: string,
  @Param('type') type: 'event' | 'classroom' | 'stream' | 'workshop'
) {
  return this.eventsService.isUserEnrolled(id, userId, type);
}


  @Get(':eventId/streams-workshops')
  @ApiOperation({
    summary: 'Obtiene streams y workshops ordenados por día y hora, con toda la información, separados por día',
    description: 'Retorna un schedule donde cada día tiene un array de items (streams o workshops).'
  })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Schedule por días con streams y workshops' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getEventStreamsAndWorkshops(@Param('eventId') eventId: string) {
    const data = await this.eventsService.getStreamsAndWorkshopsByEvent(eventId);
    if (!data) throw new NotFoundException('Evento no encontrado');
    return data;
  }

  @Post('stream/:eventStreamId/enroll')
@ApiOperation({ summary: 'Inscribir un usuario en un stream de evento' })
@ApiParam({ name: 'eventStreamId', description: 'ID del stream del evento' })
@ApiBody({ schema: { example: { userId: 'cm4sths4i0008g1865nsbbh1l' } } })
@ApiResponse({ status: 201, description: 'Usuario inscrito con éxito en el stream' })
@ApiResponse({ status: 403, description: 'El usuario ya está inscrito en el stream o no se pudo inscribir' })
@ApiResponse({ status: 404, description: 'Stream de evento no encontrado' })
async enrollEventStream(
  @Param('eventStreamId') eventStreamId: string,
  @Body() body: { userId: string }
) {
  const isEnrolled = await this.eventsService.enrollEventStream(eventStreamId, body.userId);
  if (!isEnrolled) {
    throw new ForbiddenException('El usuario ya está inscrito en el stream o no se pudo inscribir');
  }
  return { message: `Usuario ${body.userId} inscrito con éxito en el stream ${eventStreamId}` };
}


}
