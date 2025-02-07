import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        longDescription: data.longDescription,
        mainBannerUrl: data.mainBannerUrl,
        mainImageUrl: data.mainImageUrl,
        physicalLocation: data.physicalLocation,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        mapUrl: data.mapUrl,
        leadingCompanyId: data.leadingCompanyId,
        target: data.target,
      },
    });
  }

  async registerAttendee(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true },
    });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }

    const isAlreadyAttendee = event.attendees.some((u) => u.id === userId);
    if (isAlreadyAttendee) {
      return false;
    }

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: { id: userId },
        },
      },
    });
    return true;
  }

  async getEventsByLeadingCompany(empresaId: string) {
    return this.prisma.event.findMany({
      where: { leadingCompanyId: empresaId },
      include: {
        leadingCompany: true,
        attendees: true,
        streams: true,
        workshops: true,
        organizers: true,
        offers: {
          include: {
            products: true,
          },
        },
      },
    });
  }

  async getEventById(eventId: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: true,
        attendees: true,
        streams: true,
        workshops: true,
        organizers: true,
        offers: {
          include: {
            products: true,
          },
        },
      },
    });
  }

  /**
   * Retorna los streams y workshops asociados a un evento
   */
  async getStreamsAndWorkshopsByEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        streams: true,
        workshops: true,
      },
    });
    return event
      ? {
          eventId: event.id,
          streams: event.streams,
          workshops: event.workshops,
        }
      : null;
  }

  /**
   * Retorna los workshops de un classroom específico
   */
  async getWorkshopsByClassroom(classroomId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        workshops: true,
      },
    });

    return classroom?.workshops || null;
  }

  /**
   * Retorna un workshop por su ID
   */
  async getWorkshopById(workshopId: string) {
    return this.prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        event: true,
        classroom: true,
        orators: true,
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
