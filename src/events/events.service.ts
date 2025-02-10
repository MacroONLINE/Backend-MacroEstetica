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

  async getUpcomingEvents() {
    const now = new Date();
    return this.prisma.event.findMany({
      where: {
        startDateTime: {
          gte: now,
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
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

  async getUpcomingEventsByYear(year: number) {
    const currentYear = new Date().getFullYear();

    // Determinamos la fecha base (startDateTime debe ser >= esta fecha)
    let startDate: Date;
    if (year === currentYear) {
      // Año actual -> filtrar desde hoy
      startDate = new Date();
    } else {
      // Año distinto al actual -> filtrar desde 1 de enero de ese año
      // OJO: Esto incluye también años pasados, pero en la práctica
      // si la fecha ya pasó, no habrá eventos "futuros".
      startDate = new Date(year, 0, 1); // 0 = enero, día 1
    }

    return this.prisma.event.findMany({
      where: {
        startDateTime: {
          gte: startDate,
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
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
        },},
    });
  }
}
