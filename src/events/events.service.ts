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
    return this.prisma.event.findMany({
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
  }

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
                    products: true,
                  },
                },
              },
            },
          },
        },
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

    const streamOrators = event.streams?.flatMap((stream) => stream.orators) ?? [];
    const workshopOrators = event.workshops?.flatMap((workshop) => workshop.orators) ?? [];
    const oratorsMap = new Map();
    streamOrators.forEach((o) => oratorsMap.set(o.id, o));
    workshopOrators.forEach((o) => oratorsMap.set(o.id, o));
    const allOrators = Array.from(oratorsMap.values());

    const offers = event.leadingCompany?.minisite?.offers ?? [];
    const offerProducts = offers.flatMap((offer) => offer.products ?? []);

    return {
      ...event,
      allOrators,
      offerProducts,
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
    return {
      eventId: event.id,
      streams: event.streams,
      workshops: event.workshops,
      brands: event.brands,
    };
  }

  async getWorkshopById(workshopId: string) {
    return this.prisma.workshop.findUnique({
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
  }

  async getUpcomingEvents() {
    const nowUtc = new Date(new Date().toISOString());
    return this.prisma.event.findMany({
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
  }

  async getUpcomingEventsByYear(year: number) {
    const currentYear = new Date().getFullYear();
    let startDate: Date;
    if (year === currentYear) {
      startDate = new Date();
    } else {
      startDate = new Date(year, 0, 1);
    }
    return this.prisma.event.findMany({
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
  }

  async getPhysicalEvents() {
    return this.prisma.event.findMany({
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
  }

  async getPhysicalEventsByEmpresa(empresaId: string) {
    return this.prisma.event.findMany({
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
  }
}
