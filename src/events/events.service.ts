import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo Event
   */
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

  /**
   * Registra a un usuario como "attendee" en un Event
   */
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
      return false; // Ya estaba registrado
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

  /**
   * Obtiene todos los eventos liderados por una empresa en particular (leadingCompany)
   * e incluye streams, workshops, orators, attendees, etc.
   */
  async getEventsByLeadingCompany(empresaId: string) {
    return this.prisma.event.findMany({
      where: { leadingCompanyId: empresaId },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
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
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Obtiene un Event por ID,
   * incluyendo streams, workshops, orators, attendees, etc.
   * También agrega un arreglo "allOrators" con todos los oradores
   * (sin duplicados) de streams y workshops.
   * 
   * Por otro lado, trae la empresa líder (leadingCompany), su minisite,
   * sus offers y sus products. Si no existen, se devuelve un arreglo vacío.
   */
  async getEventById(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        leadingCompany: {
          include: {
            minisite: {
              include: {
                offers: {
                  include: {
                    products: true, // MinisiteOfferProduct[]
                  },
                },
              },
            },
          },
        },
        attendees: true,
        organizers: true,
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
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`No se encontró el evento con ID: ${eventId}`);
    }

    // 1) Oradores de streams:
    const streamOrators = event.streams?.flatMap((stream) => stream.orators) ?? [];

    // 2) Oradores de workshops:
    const workshopOrators = event.workshops?.flatMap((workshop) => workshop.orators) ?? [];

    // 3) Combinar ambos, evitando duplicados por su "id"
    const oratorsMap = new Map();
    streamOrators.forEach((orator) => oratorsMap.set(orator.id, orator));
    workshopOrators.forEach((orator) => oratorsMap.set(orator.id, orator));
    const allOrators = Array.from(oratorsMap.values());

    // 4) Obtener las ofertas de la empresa líder (o [])
    const companyOffers = event.leadingCompany?.minisite?.offers ?? [];

    // 5) Retornar el evento con un nuevo campo "allOrators" y "companyOffers"
    return {
      ...event,
      allOrators,
      companyOffers,
    };
  }

  /**
   * Retorna los streams y workshops asociados a un evento,
   * incluyendo orators, attendees, etc.
   */
  async getStreamsAndWorkshopsByEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
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
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!event) return null;

    return {
      eventId: event.id,
      streams: event.streams,
      workshops: event.workshops,
    };
  }

  /**
   * Obtiene un Workshop por su ID,
   * incluyendo orators, attendees, enrollments, etc.
   */
  async getWorkshopById(workshopId: string) {
    return this.prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        event: true,
        orators: true,
        attendees: true,
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  /**
   * Obtiene todos los eventos próximos (startDateTime >= now),
   * incluyendo todos los submodelos de orators, attendees, etc.
   */
  async getUpcomingEvents() {
    const nowUtc = new Date(new Date().toISOString());
    console.log('Fecha usada para el filtro (UTC):', nowUtc);

    return this.prisma.event.findMany({
      where: {
        startDateTime: {
          gte: nowUtc,
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
      include: {
        leadingCompany: true,
        attendees: true,
        organizers: true,
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
  }

  /**
   * Obtiene todos los eventos futuros en un año dado,
   * incluyendo orators, attendees, etc.
   */
  async getUpcomingEventsByYear(year: number) {
    const currentYear = new Date().getFullYear();
    let startDate: Date;

    if (year === currentYear) {
      // Si es el año actual, filtra desde hoy
      startDate = new Date();
    } else {
      // Si es un año distinto, filtra desde el 1 de enero de ese año
      startDate = new Date(year, 0, 1); 
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
        organizers: true,
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
  }
}
