import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper para formatear fecha/hora al estilo "14 de febrero de 2025, 19:14"
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    // Establecer formateadores separados para fecha y hora
    const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
    const timeFormatter = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }

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
      include: {
        attendees: true,
        brands: true,
      },
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
    const events = await this.prisma.event.findMany({
      where: { leadingCompanyId: empresaId },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });

    // Transformar fechas
    events.forEach((evt) => {
      evt.startDateTime = this.formatDate(evt.startDateTime as unknown as Date) as any;
      evt.endDateTime = this.formatDate(evt.endDateTime as unknown as Date) as any;
    });

    return events;
  }

  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID: ${eventId}`);
    }

    // Formatear fecha del evento
    event.startDateTime = this.formatDate(event.startDateTime as unknown as Date) as any;
    event.endDateTime = this.formatDate(event.endDateTime as unknown as Date) as any;

    // Formatear fechas de streams
    event.streams?.forEach((stream) => {
      stream.startDateTime = this.formatDate(stream.startDateTime as unknown as Date) as any;
      stream.endDateTime = this.formatDate(stream.endDateTime as unknown as Date) as any;
    });

    // Formatear fechas de workshops
    event.workshops?.forEach((ws) => {
      ws.startDateTime = this.formatDate(ws.startDateTime as unknown as Date) as any;
      ws.endDateTime = this.formatDate(ws.endDateTime as unknown as Date) as any;
    });

    const streamOrators = event.streams?.flatMap((s) => s.orators) ?? [];
    const workshopOrators = event.workshops?.flatMap((w) => w.orators) ?? [];
    const oratorsMap = new Map();
    streamOrators.forEach((o) => oratorsMap.set(o.id, o));
    workshopOrators.forEach((o) => oratorsMap.set(o.id, o));
    const allOrators = Array.from(oratorsMap.values());

    return {
      ...event,
      allOrators,
    };
  }

  async getStreamsAndWorkshopsByEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });
    if (!event) return null;

    // Formatear fechas de streams
    event.streams?.forEach((stream) => {
      stream.startDateTime = this.formatDate(stream.startDateTime as unknown as Date) as any;
      stream.endDateTime = this.formatDate(stream.endDateTime as unknown as Date) as any;
    });

    // Formatear fechas de workshops
    event.workshops?.forEach((ws) => {
      ws.startDateTime = this.formatDate(ws.startDateTime as unknown as Date) as any;
      ws.endDateTime = this.formatDate(ws.endDateTime as unknown as Date) as any;
    });

    return {
      eventId: event.id,
      streams: event.streams,
      workshops: event.workshops,
    };
  }

  async getWorkshopById(workshopId: string) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        event: {
          include: {
            brands: true,
          },
        },
        orators: true,
        attendees: true,
        enrollments: {
          include: { user: true },
        },
      },
    });
    if (!workshop) return null;

    // Formatear fechas del workshop
    workshop.startDateTime = this.formatDate(workshop.startDateTime as unknown as Date) as any;
    workshop.endDateTime = this.formatDate(workshop.endDateTime as unknown as Date) as any;

    // Formatear fechas de su event (si existe)
    if (workshop.event) {
      workshop.event.startDateTime = this.formatDate(workshop.event.startDateTime as unknown as Date) as any;
      workshop.event.endDateTime = this.formatDate(workshop.event.endDateTime as unknown as Date) as any;
    }

    return workshop;
  }

  async getUpcomingEvents() {
    const nowUtc = new Date(new Date().toISOString());
    const events = await this.prisma.event.findMany({
      where: {
        startDateTime: { gte: nowUtc },
      },
      orderBy: {
        startDateTime: 'asc',
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });

    events.forEach((evt) => {
      evt.startDateTime = this.formatDate(evt.startDateTime as unknown as Date) as any;
      evt.endDateTime = this.formatDate(evt.endDateTime as unknown as Date) as any;
    });

    return events;
  }

  async getUpcomingEventsByYear(year: number) {
    const currentYear = new Date().getFullYear();
    let startDate: Date;
    if (year === currentYear) {
      startDate = new Date();
    } else {
      startDate = new Date(year, 0, 1);
    }
    const events = await this.prisma.event.findMany({
      where: {
        startDateTime: { gte: startDate },
      },
      orderBy: {
        startDateTime: 'asc',
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });

    events.forEach((evt) => {
      evt.startDateTime = this.formatDate(evt.startDateTime as unknown as Date) as any;
      evt.endDateTime = this.formatDate(evt.endDateTime as unknown as Date) as any;
    });

    return events;
  }

  async getPhysicalEvents() {
    const events = await this.prisma.event.findMany({
      where: {
        physicalLocation: { not: null },
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });

    events.forEach((evt) => {
      evt.startDateTime = this.formatDate(evt.startDateTime as unknown as Date) as any;
      evt.endDateTime = this.formatDate(evt.endDateTime as unknown as Date) as any;
    });

    return events;
  }

  async getPhysicalEventsByEmpresa(empresaId: string) {
    const events = await this.prisma.event.findMany({
      where: {
        leadingCompanyId: empresaId,
        physicalLocation: { not: null },
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: {
          include: {
            orators: true,
            attendees: true,
          },
        },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: {
              include: { user: true },
            },
          },
        },
      },
    });

    events.forEach((evt) => {
      evt.startDateTime = this.formatDate(evt.startDateTime as unknown as Date) as any;
      evt.endDateTime = this.formatDate(evt.endDateTime as unknown as Date) as any;
    });

    return events;
  }

  async getLiveClassrooms() {
    const nowUtc = new Date();
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        startDateTime: { lte: nowUtc },
        endDateTime: { gte: nowUtc },
      },
      include: {
        orators: true,
        enrollments: {
          include: {
            user: true,
          },
        },
        attendees: true,
      },
    });

    // Formatear fechas
    classrooms.forEach((cls) => {
      cls.startDateTime = this.formatDate(cls.startDateTime as unknown as Date) as any;
      cls.endDateTime = this.formatDate(cls.endDateTime as unknown as Date) as any;
    });

    return classrooms;
  }
}
