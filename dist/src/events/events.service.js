"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEvent(data) {
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
    async registerAttendee(eventId, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { attendees: true },
        });
        if (!event) {
            throw new common_1.NotFoundException('Evento no encontrado');
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
    async getEventsByLeadingCompany(empresaId) {
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
    async getEventById(eventId) {
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
    async getStreamsAndWorkshopsByEvent(eventId) {
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
    async getWorkshopsByClassroom(classroomId) {
        const classroom = await this.prisma.classroom.findUnique({
            where: { id: classroomId },
            include: {
                workshops: true,
            },
        });
        return classroom?.workshops || null;
    }
    async getWorkshopById(workshopId) {
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
        const nowUtc = new Date(new Date().toISOString());
        console.log("Fecha usada para el filtro (UTC):", nowUtc);
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
    async getUpcomingEventsByYear(year) {
        const currentYear = new Date().getFullYear();
        let startDate;
        if (year === currentYear) {
            startDate = new Date();
        }
        else {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map