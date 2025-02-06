import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class EventStreamsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStream(data: any) {
    // Genera un channelName como UUID (si no deseas usar el que venga de data)
    const channelName = data.channelName || randomUUID();

    return this.prisma.eventStream.create({
      data: {
        eventId: data.eventId,
        channelName,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
      },
    });
  }

  async getStreamById(id: string) {
    return this.prisma.eventStream.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            leadingCompany: true,
            attendees: true,
            organizers: true,
            workshops: true,
          },
        },
        orators: true,
      },
    });
  }
}
