import { Body, Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { EventStreamsService } from './event-streams.service';

@Controller('event-streams')
export class EventStreamsController {
  constructor(private readonly eventStreamsService: EventStreamsService) {}

  @Post()
  async createStream(@Body() body: any) {
    return this.eventStreamsService.createStream(body);
  }

  @Get(':channelName')
  async getStreamByChannelName(@Param('channelName') channelName: string) {
    const stream = await this.eventStreamsService.getStreamByChannelName(channelName);
    if (!stream) throw new NotFoundException('Stream no encontrado');
    return stream;
  }
}
