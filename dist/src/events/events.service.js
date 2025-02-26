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
    formatDate(date) {
        const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' });
        const timeFormatter = new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' });
        return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
    }
    fullyFormatDates(obj) {
        if (obj === null || obj === undefined)
            return obj;
        if (Array.isArray(obj)) {
            return obj.map((item) => this.fullyFormatDates(item));
        }
        if (obj instanceof Date) {
            return this.formatDate(obj);
        }
        if (typeof obj === 'object') {
            const newObj = {};
            for (const key of Object.keys(obj)) {
                const value = obj[key];
                newObj[key] = this.fullyFormatDates(value);
            }
            return newObj;
        }
        return obj;
    }
    async createEvent(data) {
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
            data: { attendees: { connect: { id: userId } } },
        });
        return true;
    }
    async isUserEnrolled(id, userId, type) {
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
                throw new common_1.NotFoundException(`Tipo inválido: ${type}`);
        }
    }
    async getEventById(eventId) {
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
            throw new common_1.NotFoundException(`No se encontró el evento con ID: ${eventId}`);
        }
        let allOrators = [];
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
        const uniqueOrators = Array.from(new Map(allOrators.map((orator) => [orator.id, orator])).values());
        event.allOrators = uniqueOrators;
        return this.fullyFormatDates(event);
    }
    async getStreamsAndWorkshopsByEvent(eventId) {
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
        if (!event)
            return null;
        const allItems = [];
        for (const stream of event.streams ?? []) {
            allItems.push({ type: 'stream', ...stream });
        }
        for (const wk of event.workshops ?? []) {
            allItems.push({ type: 'workshop', ...wk });
        }
        const groups = {};
        for (const item of allItems) {
            const realDate = item.startDateTime;
            const dayKey = new Date(realDate.getFullYear(), realDate.getMonth(), realDate.getDate()).getTime();
            groups[dayKey] ??= [];
            groups[dayKey].push(item);
        }
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
        return this.fullyFormatDates(result);
    }
    async getFullSchedule(eventId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                streams: true,
                workshops: true,
            },
        });
        if (!event)
            return null;
        const allItems = [];
        for (const s of event.streams ?? []) {
            allItems.push({ type: 'stream', ...s });
        }
        for (const wk of event.workshops ?? []) {
            allItems.push({ type: 'workshop', ...wk });
        }
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
    async getWorkshopById(workshopId) {
        const workshop = await this.prisma.workshop.findUnique({
            where: { id: workshopId },
            include: {
                event: { include: { brands: true } },
                orators: true,
                attendees: true,
                enrollments: { include: { user: true } },
            },
        });
        if (!workshop)
            return null;
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
    async getUpcomingEventsByYear(year) {
        const currentYear = new Date().getFullYear();
        let startDate;
        if (year === currentYear) {
            startDate = new Date();
        }
        else {
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
    async getPhysicalEventsByEmpresa(empresaId) {
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
        if (!result.length)
            return [];
        return result;
    }
    async getEventsByLeadingCompany(empresaId) {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map