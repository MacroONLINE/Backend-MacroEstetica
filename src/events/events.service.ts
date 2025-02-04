import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        location: data.location,
        bannerUrl: data.bannerUrl,
        companyId: data.companyId,
        instructorId: data.instructorId,
        ctaUrl: data.ctaUrl,
        ctaButtonText: data.ctaButtonText,
        logoUrl: data.logoUrl,
      },
    });
  }

  async registerAttendee(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: true,
      },
    });
    if (!event) throw new NotFoundException('Evento no encontrado');

    const isAlreadyAttendee = event.attendees.some((u) => u.id === userId);
    if (isAlreadyAttendee) {
      throw new ForbiddenException('El usuario ya está inscrito en este evento');
    }

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
    });

    return { message: `Usuario ${userId} registrado con éxito en el evento ${eventId}` };
  }

  async getEventsByEmpresaId(empresaId: string) {
    return this.prisma.event.findMany({
      where: { companyId: empresaId },
      include: {
        instructor: true,
        categories: true,
        attendees: true,
        streams: true
      },
    });
  }

  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        instructor: true,
        attendees: true,
        categories: true,
        streams: true
      },
    });
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }
}
