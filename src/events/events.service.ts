import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatDate(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
    const timeFormatter = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }

  private withFormattedDates<T extends { startDateTime?: Date; endDateTime?: Date }>(
    item: T
  ): T & { startDateTimeFormatted?: string; endDateTimeFormatted?: string } {
    const startDateTimeFormatted = item.startDateTime
      ? this.formatDate(item.startDateTime)
      : undefined;
    const endDateTimeFormatted = item.endDateTime
      ? this.formatDate(item.endDateTime)
      : undefined;

    return {
      ...item,
      startDateTimeFormatted,
      endDateTimeFormatted,
    };
  }

  async createEvent(data: any) {
    const event = await this.prisma.event.create({
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
    return this.withFormattedDates(event);
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
        attendees: { connect: { id: userId } },
      },
    });
    return true;
  }

  async isUserEnrolled(eventId: string, userId: string) {
    const enrollment = await this.prisma.eventEnrollment.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
    return !!enrollment;
  }

  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID: ${eventId}`);
    }

    const eventFormatted = this.withFormattedDates(event);
    const streamsFormatted = eventFormatted.streams?.map((s) => this.withFormattedDates(s));
    const workshopsFormatted = eventFormatted.workshops?.map((w) => this.withFormattedDates(w));

    const streamOrators = event.streams?.flatMap((s) => s.orators) ?? [];
    const workshopOrators = event.workshops?.flatMap((w) => w.orators) ?? [];
    const oratorsMap = new Map();
    streamOrators.forEach((o) => oratorsMap.set(o.id, o));
    workshopOrators.forEach((o) => oratorsMap.set(o.id, o));
    const allOrators = Array.from(oratorsMap.values());

    return {
      ...eventFormatted,
      streams: streamsFormatted,
      workshops: workshopsFormatted,
      allOrators,
    };
  }

  /**
   * NUEVO método para retornar streams y workshops en un schedule, 
   * agrupados por DÍA y ordenados por hora dentro de cada día.
   * Retorna toda la información de cada stream/workshop.
   */
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
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    if (!event) return null;

    const eventFormatted = this.withFormattedDates(event);

    // Preparar un array con todos los items (streams + workshops)
    const allItems = [];

    for (const stream of event.streams ?? []) {
      const streamFormatted = this.withFormattedDates(stream);
      allItems.push({
        type: 'stream',
        ...streamFormatted,
      });
    }
    for (const wk of event.workshops ?? []) {
      const wkFormatted = this.withFormattedDates(wk);
      allItems.push({
        type: 'workshop',
        ...wkFormatted,
      });
    }

    // Agrupar por "día" => p.e. setHours(0,0,0,0) para la fecha
    const groups: Record<string, any[]> = {};

    allItems.forEach((item) => {
      const realDate = item.startDateTime as Date;
      const dayKey = new Date(realDate.getFullYear(), realDate.getMonth(), realDate.getDate()).getTime();
      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(item);
    });

    // Para cada día, ordenar por hora
    // Y mapear a un array ordenado de días (asc).
    const sortedDays = Object.keys(groups)
      .map((dayKey) => parseInt(dayKey, 10))
      .sort((a, b) => a - b);

    const schedule = sortedDays.map((dayKey) => {
      const dayItems = groups[dayKey];
      dayItems.sort((a, b) => {
        // a.startDateTime y b.startDateTime son Date
        return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
      });

      const dayDate = new Date(dayKey); 
      // p.e. "13 de febrero de 2025"
      const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
      const dayLabel = dateFormatter.format(dayDate);

      return {
        day: dayLabel,
        items: dayItems, 
      };
    });

    return {
      eventId: event.id,
      eventTitle: eventFormatted.title,
      eventStartDateFormatted: eventFormatted.startDateTimeFormatted,
      eventEndDateFormatted: eventFormatted.endDateTimeFormatted,
      schedule,
    };
  }

  async getFullSchedule(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        streams: true,
        workshops: true,
      },
    });
    if (!event) return null;

    const eventFormatted = this.withFormattedDates(event);
    const allItems = [];

    for (const s of event.streams ?? []) {
      const sf = this.withFormattedDates(s);
      allItems.push({
        type: 'stream',
        ...sf,
      });
    }
    for (const wk of event.workshops ?? []) {
      const wkf = this.withFormattedDates(wk);
      allItems.push({
        type: 'workshop',
        ...wkf,
      });
    }

    allItems.sort((a, b) => {
      const realA = a.startDateTime as Date;
      const realB = b.startDateTime as Date;
      return new Date(realA).getTime() - new Date(realB).getTime();
    });

    return {
      eventTitle: eventFormatted.title,
      eventStart: eventFormatted.startDateTimeFormatted,
      eventEnd: eventFormatted.endDateTimeFormatted,
      schedule: allItems,
    };
  }

  async getWorkshopById(workshopId: string) {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        event: { include: { brands: true } },
        orators: true,
        attendees: true,
        enrollments: { include: { user: true } },
      },
    });
    if (!workshop) return null;

    const workshopFormatted = this.withFormattedDates(workshop);
    if (workshopFormatted.event) {
      workshopFormatted.event = this.withFormattedDates(workshopFormatted.event);
    }
    return workshopFormatted;
  }

  async getUpcomingEvents() {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: { startDateTime: { gte: now } },
      orderBy: { startDateTime: 'asc' },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    return events.map((evt) => {
      const formattedEvt = this.withFormattedDates(evt);
      formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
      formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
      return formattedEvt;
    });
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
      where: { startDateTime: { gte: startDate } },
      orderBy: { startDateTime: 'asc' },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: { orators: true, attendees: true, enrollments: { include: { user: true } } },
        },
      },
    });
    const result = events.map((evt) => {
      const formattedEvt = this.withFormattedDates(evt);
      formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
      formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
      return formattedEvt;
    });
    if (!result.length) return [];
    return result;
  }

  async getPhysicalEvents() {
    const events = await this.prisma.event.findMany({
      where: { physicalLocation: { not: null } },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    return events.map((evt) => {
      const formattedEvt = this.withFormattedDates(evt);
      formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
      formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
      return formattedEvt;
    });
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
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    return events.map((evt) => {
      const formattedEvt = this.withFormattedDates(evt);
      formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
      formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
      return formattedEvt;
    });
  }

  async getLiveEvents() {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        startDateTime: { lte: now },
        endDateTime: { gte: now },
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: {
            orators: true,
            attendees: true,
            enrollments: { include: { user: true } },
          },
        },
      },
    });
    const result = events.map((evt) => {
      const formattedEvt = this.withFormattedDates(evt);
      formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
      formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
      return formattedEvt;
    });
    if (!result.length) return [];
    return result;
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
      },
    });
  }
}
