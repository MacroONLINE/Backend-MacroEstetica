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
    withFormattedDates(item) {
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
        return this.withFormattedDates(event);
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
                attendees: { connect: { id: userId } },
            },
        });
        return true;
    }
    async isUserEnrolled(eventId, userId) {
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
    async getEventById(eventId) {
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
            throw new common_1.NotFoundException(`No se encontró el evento con ID: ${eventId}`);
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
    async getStreamsAndWorkshopsByEvent(eventId) {
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
        if (!event)
            return null;
        const eventFormatted = this.withFormattedDates(event);
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
        const groups = {};
        allItems.forEach((item) => {
            const realDate = item.startDateTime;
            const dayKey = new Date(realDate.getFullYear(), realDate.getMonth(), realDate.getDate()).getTime();
            if (!groups[dayKey]) {
                groups[dayKey] = [];
            }
            groups[dayKey].push(item);
        });
        const sortedDays = Object.keys(groups)
            .map((dayKey) => parseInt(dayKey, 10))
            .sort((a, b) => a - b);
        const schedule = sortedDays.map((dayKey) => {
            const dayItems = groups[dayKey];
            dayItems.sort((a, b) => {
                return new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
            });
            const dayDate = new Date(dayKey);
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
            const realA = a.startDateTime;
            const realB = b.startDateTime;
            return new Date(realA).getTime() - new Date(realB).getTime();
        });
        return {
            eventTitle: eventFormatted.title,
            eventStart: eventFormatted.startDateTimeFormatted,
            eventEnd: eventFormatted.endDateTimeFormatted,
            schedule: allItems,
        };
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
        const result = events.map((evt) => {
            const formattedEvt = this.withFormattedDates(evt);
            formattedEvt.streams = evt.streams?.map((s) => this.withFormattedDates(s));
            formattedEvt.workshops = evt.workshops?.map((w) => this.withFormattedDates(w));
            return formattedEvt;
        });
        if (!result.length)
            return [];
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
        if (!result.length)
            return [];
        return result;
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