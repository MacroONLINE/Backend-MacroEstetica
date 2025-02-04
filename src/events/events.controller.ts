import { Body, Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() body: any) {
    return this.eventsService.createEvent(body);
  }

  @Post(':eventId/register')
  async registerAttendee(@Param('eventId') eventId: string, @Body() body: { userId: string }) {
    return this.eventsService.registerAttendee(eventId, body.userId);
  }

  @Get('empresa/:empresaId')
  async getEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getEventsByEmpresaId(empresaId);
  }

  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    const event = await this.eventsService.getEventById(eventId);
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }
}
