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
    async registerAttendee(eventId, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                attendees: true,
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Evento no encontrado');
        const isAlreadyAttendee = event.attendees.some((u) => u.id === userId);
        if (isAlreadyAttendee) {
            throw new common_1.ForbiddenException('El usuario ya está inscrito en este evento');
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
    async getEventsByEmpresaId(empresaId) {
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
    async getEventById(eventId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                instructor: true,
                attendees: true,
                categories: true,
                streams: true
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Evento no encontrado');
        return event;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map