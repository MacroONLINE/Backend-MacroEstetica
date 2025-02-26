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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const events_service_1 = require("./events.service");
let EventsController = class EventsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async createEvent(body) {
        return this.eventsService.createEvent(body);
    }
    async registerAttendee(eventId, body) {
        const isRegistered = await this.eventsService.registerAttendee(eventId, body.userId);
        if (!isRegistered) {
            throw new common_1.ForbiddenException('El usuario ya está inscrito o no se pudo inscribir en este evento');
        }
        return { message: `Usuario ${body.userId} registrado con éxito en el evento ${eventId}` };
    }
    async getPhysicalEvents() {
        return this.eventsService.getPhysicalEvents();
    }
    async getPhysicalEventsByEmpresa(empresaId) {
        return this.eventsService.getPhysicalEventsByEmpresa(empresaId);
    }
    async getEventsByEmpresa(empresaId) {
        return this.eventsService.getEventsByLeadingCompany(empresaId);
    }
    async getUpcomingEvents() {
        return this.eventsService.getUpcomingEvents();
    }
    async getUpcomingEventsByYear(year) {
        const events = await this.eventsService.getUpcomingEventsByYear(year);
        if (!events || events.length === 0) {
            throw new common_1.NotFoundException(`No se encontraron eventos futuros para el año ${year}`);
        }
        return events;
    }
    async getLiveEvents() {
        const events = await this.eventsService.getLiveEvents();
        if (!events || events.length === 0) {
            throw new common_1.NotFoundException('No hay eventos en vivo en este momento');
        }
        return events;
    }
    async getEventById(eventId) {
        const event = await this.eventsService.getEventById(eventId);
        if (!event)
            throw new common_1.NotFoundException('Evento no encontrado');
        return event;
    }
    async isUserEnrolled(id, userId, type) {
        return this.eventsService.isUserEnrolled(id, userId, type);
    }
    async getEventStreamsAndWorkshops(eventId) {
        const data = await this.eventsService.getStreamsAndWorkshopsByEvent(eventId);
        if (!data)
            throw new common_1.NotFoundException('Evento no encontrado');
        return data;
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo evento' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Evento creado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos para la creación del evento' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Post)(':eventId/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registra un usuario como asistente de un evento' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento a inscribir' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado con éxito' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'El usuario ya está inscrito o no se pudo inscribir' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento no encontrado' }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "registerAttendee", null);
__decorate([
    (0, common_1.Get)('physical'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos presenciales (con location física)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos presenciales' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getPhysicalEvents", null);
__decorate([
    (0, common_1.Get)('physical/empresa/:empresaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos presenciales de una empresa líder' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa líder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos presenciales para la empresa indicada' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getPhysicalEventsByEmpresa", null);
__decorate([
    (0, common_1.Get)('empresa/:empresaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos de una empresa líder' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa líder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna la lista de eventos de la empresa líder' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventsByEmpresa", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos próximos a partir de la fecha/hora actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos próximos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getUpcomingEvents", null);
__decorate([
    (0, common_1.Get)('upcoming/:year'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene todos los eventos futuros de un año específico',
        description: 'Si el año es el actual, se filtra desde hoy; si es distinto, se filtra desde el 1 de enero de ese año.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'year',
        required: true,
        description: 'Año para el cual se obtendrán los eventos futuros. Puede ser el año actual o uno futuro.',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos futuros para el año especificado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontraron eventos para el rango indicado' }),
    __param(0, (0, common_1.Param)('year', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getUpcomingEventsByYear", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos en vivo en este momento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de eventos en vivo' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No hay eventos en vivo en este momento' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getLiveEvents", null);
__decorate([
    (0, common_1.Get)(':eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un evento por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna el evento si se encuentra' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento no encontrado' }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Get)(':id/is-enrolled/:userId/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Verifica si un usuario está inscrito en un evento, aula, transmisión en vivo o taller' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del evento, aula, transmisión o taller' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Tipo de entidad: event, classroom, stream, workshop' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'true o false, dependiendo si el usuario está inscrito' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "isUserEnrolled", null);
__decorate([
    (0, common_1.Get)(':eventId/streams-workshops'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene streams y workshops ordenados por día y hora, con toda la información, separados por día',
        description: 'Retorna un schedule donde cada día tiene un array de items (streams o workshops).'
    }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule por días con streams y workshops' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento no encontrado' }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventStreamsAndWorkshops", null);
exports.EventsController = EventsController = __decorate([
    (0, swagger_1.ApiTags)('Events'),
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map