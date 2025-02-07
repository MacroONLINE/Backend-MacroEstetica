import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo evento' })
  @ApiResponse({
    status: 201,
    description: 'Evento creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para la creación del evento',
  })
  async createEvent(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }

  @Post(':eventId/register')
  @ApiOperation({ summary: 'Registra un usuario como asistente de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento a inscribir' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado con éxito',
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario ya está inscrito o no se pudo inscribir',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
  })
  async registerAttendee(
    @Param('eventId') eventId: string,
    @Body() body: { userId: string },
  ) {
    const { userId } = body;
    const isRegistered = await this.eventsService.registerAttendee(eventId, userId);
    if (!isRegistered) {
      throw new ForbiddenException(
        'El usuario ya está inscrito o no se pudo inscribir en este evento',
      );
    }
    return {
      message: `Usuario ${userId} registrado con éxito en el evento ${eventId}`,
    };
  }

  @Get('empresa/:empresaId')
  @ApiOperation({ summary: 'Obtiene todos los eventos de una empresa líder' })
  @ApiParam({ name: 'empresaId', description: 'ID de la empresa líder' })
  @ApiResponse({
    status: 200,
    description: 'Retorna la lista de eventos relacionados con la empresa líder',
  })
  async getEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getEventsByLeadingCompany(empresaId);
  }

  @Get(':eventId')
  @ApiOperation({ summary: 'Obtiene un evento por su ID' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el evento si se encuentra',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
  })
  async getEventById(@Param('eventId') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  @Get(':eventId/streams-workshops')
  @ApiOperation({ summary: 'Obtiene los streams y workshops de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({
    status: 200,
    description: 'Retorna los streams y workshops asociados al evento',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento no encontrado',
  })
  async getEventStreamsAndWorkshops(@Param('eventId') eventId: string) {
    const data = await this.eventsService.getStreamsAndWorkshopsByEvent(eventId);
    if (!data) throw new NotFoundException('Evento no encontrado');
    return data;
  }
}

/**
 * Aquí, por conveniencia, te muestro un fragmento de controlador adicional (o podrías hacerlo en el mismo si gustas)
 * para Classroom y Workshops. Pero también puedes tenerlo todo en un mismo controller, según tu arquitectura.
 */

// Optional: un sub-controlador para Workshops/Classrooms
@ApiTags('Workshops')
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':workshopId')
  @ApiOperation({ summary: 'Obtiene un workshop por su ID' })
  @ApiParam({ name: 'workshopId', description: 'ID del workshop' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el workshop si se encuentra',
  })
  @ApiResponse({
    status: 404,
    description: 'Workshop no encontrado',
  })
  async getWorkshopById(@Param('workshopId') workshopId: string) {
    const workshop = await this.eventsService.getWorkshopById(workshopId);
    if (!workshop) throw new NotFoundException('Workshop no encontrado');
    return workshop;
  }
}

@ApiTags('Classrooms')
@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':classroomId/workshops')
  @ApiOperation({ summary: 'Obtiene todos los workshops asociados a un classroom' })
  @ApiParam({ name: 'classroomId', description: 'ID del classroom' })
  @ApiResponse({
    status: 200,
    description: 'Retorna la lista de workshops asociados al classroom',
  })
  @ApiResponse({
    status: 404,
    description: 'Classroom no encontrado o no tiene workshops',
  })
  async getWorkshopsByClassroom(@Param('classroomId') classroomId: string) {
    const workshops = await this.eventsService.getWorkshopsByClassroom(classroomId);
    if (!workshops) throw new NotFoundException('No se encontraron workshops o classroom inexistente');
    return workshops;
  }
}
