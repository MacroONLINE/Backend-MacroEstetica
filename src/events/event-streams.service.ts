import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventStreamsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStream(data: any) {
    return this.prisma.eventStream.create({
      data: {
        eventId: data.eventId,
        channelName: data.channelName,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      },
    });
  }

  async getStreamByChannelName(channelName: string) {
    return this.prisma.eventStream.findUnique({
      where: { channelName },
      include: {
        event: {
          include: {
            instructor: { select: { userId: true } },
            attendees: { select: { id: true } },
          },
        },
      },
    });
  }
}
