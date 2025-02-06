import { Body, Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { EventStreamsService } from './event-streams.service';

@Controller('event-streams')
export class EventStreamsController {
  constructor(private readonly eventStreamsService: EventStreamsService) {}

  @Post()
  async createStream(@Body() body: any) {
    return this.eventStreamsService.createStream(body);
  }

  @Get(':id')
  async getStreamById(@Param('id') id: string) {
    const stream = await this.eventStreamsService.getStreamById(id);
    if (!stream) throw new NotFoundException('Stream no encontrado');
    return stream;
  }
}
