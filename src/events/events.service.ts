import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * 1) Se hace la lógica y agregación con Date original
 * 2) Al final, se hace una copia con todas las fechas formateadas recursivamente
 */
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatDate(date: Date): string {
    const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
    const timeFormatter = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' });
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }

  /**
   * Recorre recursivamente el objeto (incluyendo arrays y sub-objetos),
   * y reemplaza las propiedades Date por strings formateadas.
   */
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
  
  

  /**
   * Retorna un evento con TODAS las fechas formateadas
   */
  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: true,
        organizers: true,
        brands: true,
        streams: {
          include: { orators: true },
        },
        workshops: {
          include: {
            orators: true
          },
        },
      },
    });
    
    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID: ${eventId}`);
    }
    
    // Agregar todos los orators de streams y workshops
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
    
    // Eliminar duplicados basándonos en el id del orator
    const uniqueOrators = Array.from(
      new Map(allOrators.map((orator) => [orator.id, orator])).values()
    );
    
    // Agregar el nuevo campo con la lista de todos los orators
    (event as any).allOrators = uniqueOrators;
    
    return this.fullyFormatDates(event);
  }
  

  /**
   * 2) APLICAMOS la lógica de streams y workshops POR DÍA usando los Date crudos
   * y AL FINAL formateamos todo con fullyFormatDates.
   */
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

    // 1) Creamos un array con streams y workshops con sus Date originales
    const allItems: any[] = [];
    for (const stream of event.streams ?? []) {
      allItems.push({ type: 'stream', ...stream });
    }
    for (const wk of event.workshops ?? []) {
      allItems.push({ type: 'workshop', ...wk });
    }

    // 2) Agrupamos por DIA usando la fecha real
    const groups: Record<string, any[]> = {};
    for (const item of allItems) {
      const realDate: Date = item.startDateTime; // Objeto Date
      const dayKey = new Date(
        realDate.getFullYear(),
        realDate.getMonth(),
        realDate.getDate()
      ).getTime();

      groups[dayKey] ??= [];
      groups[dayKey].push(item);
    }

    // 3) Para cada día, ordenamos por hora
    const sortedDays = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);

    const schedule = sortedDays.map((dayKey) => {
      const dayItems = groups[dayKey];

      dayItems.sort((a, b) => {
        const A = a.startDateTime.getTime();
        const B = b.startDateTime.getTime();
        return A - B;
      });

      // Nombre de día (ej: "1 de marzo de 2025")
      const dayDate = new Date(dayKey);
      const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
      const dayLabel = dateFormatter.format(dayDate);

      return { day: dayLabel, items: dayItems };
    });

    // 4) Ahora que tenemos el schedule final, incluimos
    //    la info del evento (en crudo). Formateamos al final
    const result = {
      eventId: event.id,
      eventTitle: event.title,
      eventStartDate: event.startDateTime,
      eventEndDate: event.endDateTime,
      schedule,
    };
    // 5) fullyFormatDates en TODO el objeto 'result' para que
    //    streams, workshops y sub-objetos también se formateen
    return this.fullyFormatDates(result);
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

    const allItems: any[] = [];
    for (const s of event.streams ?? []) {
      allItems.push({ type: 'stream', ...s });
    }
    for (const wk of event.workshops ?? []) {
      allItems.push({ type: 'workshop', ...wk });
    }

    // Ordenar por startDateTime real
    allItems.sort((a, b) => {
      const A = a.startDateTime.getTime();
      const B = b.startDateTime.getTime();
      return A - B;
    });

    const result = {
      eventTitle: event.title,
      eventStart: event.startDateTime,
      eventEnd: event.endDateTime,
      schedule: allItems,
    };
    return this.fullyFormatDates(result);
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
    return this.fullyFormatDates(workshop);
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
    const result = events.map((evt) => this.fullyFormatDates(evt));
    if (!result.length) return [];
    return result;
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
    return events.map((evt) => this.fullyFormatDates(evt));
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
  
}
function uuidv4(): any {
  throw new Error('Function not implemented.');
}

