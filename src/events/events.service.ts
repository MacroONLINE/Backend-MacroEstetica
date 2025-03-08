import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatDate(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
    const timeFormatter = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }

  private fullyFormatDates(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
      return obj.map((item) => this.fullyFormatDates(item));
    }
    if (obj instanceof Date) {
      return this.formatDate(obj);
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        newObj[key] = this.fullyFormatDates(value);
      }
      return newObj;
    }
    return obj;
  }

  private setIsLiveOnEvents(events: any | any[]): void {
    const now = new Date();
    if (Array.isArray(events)) {
      for (const evt of events) {
        evt.isLive = now >= evt.startDateTime && now <= evt.endDateTime;
      }
    } else if (events) {
      events.isLive = now >= events.startDateTime && now <= events.endDateTime;
    }
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
    return this.fullyFormatDates(event);
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
      data: { attendees: { connect: { id: userId } } },
    });
    return true;
  }

  async enrollEventStream(eventStreamId: string, userId: string): Promise<boolean> {
    const stream = await this.prisma.eventStream.findUnique({
      where: { id: eventStreamId },
    });
    if (!stream) {
      throw new NotFoundException(`Stream con ID ${eventStreamId} no encontrado`);
    }
    const existingEnrollment = await this.prisma.eventStreamEnrollment.findFirst({
      where: { eventStreamId, userId },
    });
    if (existingEnrollment) {
      return false;
    }
    await this.prisma.eventStreamEnrollment.create({
      data: {
        id: uuidv4(),
        eventStreamId,
        userId,
        status: 'ENROLLED',
      },
    });
    return true;
  }

  async enrollWorkshop(workshopId: string, userId: string): Promise<boolean> {
    const workshop = await this.prisma.workshop.findUnique({
      where: { id: workshopId },
      include: { event: true },
    });
    if (!workshop) {
      throw new NotFoundException(`Workshop con ID ${workshopId} no encontrado`);
    }
    if (!workshop.eventId) {
      throw new ForbiddenException('Este workshop no está asociado a ningún evento, o no requiere inscripción de evento');
    }
    const eventEnrollment = await this.prisma.eventEnrollment.findFirst({
      where: { eventId: workshop.eventId, userId },
    });
    if (!eventEnrollment) {
      throw new ForbiddenException('El usuario no está inscrito en el evento al que pertenece este workshop');
    }
    const existingEnrollment = await this.prisma.workshopEnrollment.findFirst({
      where: { workshopId, userId },
    });
    if (existingEnrollment) {
      return false;
    }
    await this.prisma.workshopEnrollment.create({
      data: {
        id: uuidv4(),
        workshopId,
        userId,
        status: 'ENROLLED',
      },
    });
    return true;
  }

  async enrollClassroom(classroomId: string, userId: string): Promise<boolean> {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom con ID ${classroomId} no encontrado`);
    }
    const existingEnrollment = await this.prisma.classroomEnrollment.findFirst({
      where: { classroomId, userId },
    });
    if (existingEnrollment) {
      return false;
    }
    await this.prisma.classroomEnrollment.create({
      data: {
        id: uuidv4(),
        classroomId,
        userId,
        status: 'ENROLLED',
      },
    });
    return true;
  }

  async isUserEnrolled(
    id: string,
    userId: string,
    type: 'event' | 'classroom' | 'stream' | 'workshop'
  ): Promise<boolean> {
    switch (type) {
      case 'event':
        return !!(await this.prisma.eventEnrollment.findFirst({
          where: { eventId: id, userId },
        }));
      case 'classroom':
        return !!(await this.prisma.classroomEnrollment.findFirst({
          where: { classroomId: id, userId },
        }));
      case 'stream':
        return !!(await this.prisma.eventStreamEnrollment.findFirst({
          where: { eventStreamId: id, userId },
        }));
      case 'workshop':
        return !!(await this.prisma.workshopEnrollment.findFirst({
          where: { workshopId: id, userId },
        }));
      default:
        throw new NotFoundException(`Tipo inválido: ${type}`);
    }
  }

  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: true,
        organizers: true,
        brands: true,
        streams: { include: { orators: true } },
        workshops: { include: { orators: true } },
      },
    });
    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID: ${eventId}`);
    }
    let allOrators: any[] = [];
    if (event.streams && event.streams.length > 0) {
      event.streams.forEach((stream) => {
        if (stream.orators && stream.orators.length > 0) {
          allOrators.push(...stream.orators);
        }
      });
    }
    if (event.workshops && event.workshops.length > 0) {
      event.workshops.forEach((workshop) => {
        if (workshop.orators && workshop.orators.length > 0) {
          allOrators.push(...workshop.orators);
        }
      });
    }
    const uniqueOrators = Array.from(new Map(allOrators.map((o) => [o.id, o])).values());
    (event as any).allOrators = uniqueOrators;
    this.setIsLiveOnEvents(event);
    return this.fullyFormatDates(event);
  }

  async getStreamsAndWorkshopsByEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        brands: true,
        streams: { include: { orators: true, attendees: true } },
        workshops: {
          include: { orators: true, attendees: true, enrollments: { include: { user: true } } },
        },
      },
    });
    if (!event) return null;
    const allItems: any[] = [];
    for (const stream of event.streams ?? []) {
      allItems.push({ type: 'stream', ...stream });
    }
    for (const wk of event.workshops ?? []) {
      allItems.push({ type: 'workshop', ...wk });
    }
    const groups: Record<string, any[]> = {};
    for (const item of allItems) {
      const d = item.startDateTime;
      const dayKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      groups[dayKey] ??= [];
      groups[dayKey].push(item);
    }
    const sortedDays = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);
    const schedule = sortedDays.map((dayKey) => {
      const dayItems = groups[dayKey];
      dayItems.sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());
      const dayDate = new Date(dayKey);
      const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
      const dayLabel = dateFormatter.format(dayDate);
      return { day: dayLabel, items: dayItems };
    });
    const result = {
      eventId: event.id,
      eventTitle: event.title,
      eventStartDate: event.startDateTime,
      eventEndDate: event.endDateTime,
      schedule,
    };
    const now = new Date();
    (result as any).isLive = now >= event.startDateTime && now <= event.endDateTime;
    return this.fullyFormatDates(result);
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
          include: { orators: true, attendees: true, enrollments: { include: { user: true } } },
        },
      },
    });
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
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
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
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
          include: { orators: true, attendees: true, enrollments: { include: { user: true } } },
        },
      },
    });
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
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
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
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
          include: { orators: true, attendees: true, enrollments: { include: { user: true } } },
        },
      },
    });
    if (!events.length) return [];
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
  }

  async getEventsByLeadingCompany(empresaId: string) {
    const events = await this.prisma.event.findMany({
      where: { leadingCompanyId: empresaId },
      include: {
        leadingCompany: true,
        attendees: true,
        streams: true,
        workshops: true,
        organizers: true,
      },
    });
    this.setIsLiveOnEvents(events);
    return events.map((evt) => this.fullyFormatDates(evt));
  }

  async getOratorsByChannelName(channelName: string) {
    const stream = await this.prisma.eventStream.findUnique({
      where: { channelName },
      include: { orators: true },
    });
    if (stream) {
      return { type: 'stream', entityId: stream.id, orators: stream.orators };
    }
    const workshop = await this.prisma.workshop.findUnique({
      where: { channelName },
      include: { orators: true },
    });
    if (workshop) {
      return { type: 'workshop', entityId: workshop.id, orators: workshop.orators };
    }
    const classroom = await this.prisma.classroom.findUnique({
      where: { channelName },
      include: { orators: true },
    });
    if (classroom) {
      return { type: 'classroom', entityId: classroom.id, orators: classroom.orators };
    }
    throw new NotFoundException(`No se encontró un stream, workshop o classroom con channelName: ${channelName}`);
  }
}
