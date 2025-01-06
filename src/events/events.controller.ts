import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * GET /events/empresa/:empresaId
   * Retorna los eventos de una empresa concreta.
   * @param empresaId ID de la empresa
   */
  @Get('empresa/:empresaId')
  async getEventsByEmpresa(@Param('empresaId') empresaId: string) {
    return this.eventsService.getEventsByEmpresaId(empresaId);
  }
}
