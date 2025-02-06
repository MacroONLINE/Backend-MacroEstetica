import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }

  @Post(':eventId/register')
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
    return { message: `Usuario ${userId} registrado con éxito en el evento ${eventId}` };
  }

  @Get('empresa/:empresaId')
  async getEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getEventsByLeadingCompany(empresaId);
  }

  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }
}
