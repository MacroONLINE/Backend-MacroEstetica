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
exports.ClassroomController = exports.WorkshopsController = exports.EventsController = void 0;
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
        const { userId } = body;
        const isRegistered = await this.eventsService.registerAttendee(eventId, userId);
        if (!isRegistered) {
            throw new common_1.ForbiddenException('El usuario ya está inscrito o no se pudo inscribir en este evento');
        }
        return {
            message: `Usuario ${userId} registrado con éxito en el evento ${eventId}`,
        };
    }
    async getEventsByEmpresa(empresaId) {
        return this.eventsService.getEventsByLeadingCompany(empresaId);
    }
    async getEventById(eventId) {
        const event = await this.eventsService.getEventById(eventId);
        if (!event)
            throw new common_1.NotFoundException('Evento no encontrado');
        return event;
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
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Evento creado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos para la creación del evento',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Post)(':eventId/register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registra un usuario como asistente de un evento' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento a inscribir' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario registrado con éxito',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'El usuario ya está inscrito o no se pudo inscribir',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Evento no encontrado',
    }),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "registerAttendee", null);
__decorate([
    (0, common_1.Get)('empresa/:empresaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los eventos de una empresa líder' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa líder' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna la lista de eventos relacionados con la empresa líder',
    }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventsByEmpresa", null);
__decorate([
    (0, common_1.Get)(':eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un evento por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna el evento si se encuentra',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Evento no encontrado',
    }),
    __param(0, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventById", null);
__decorate([
    (0, common_1.Get)(':eventId/streams-workshops'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene los streams y workshops de un evento' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'ID del evento' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna los streams y workshops asociados al evento',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Evento no encontrado',
    }),
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
let WorkshopsController = class WorkshopsController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async getWorkshopById(workshopId) {
        const workshop = await this.eventsService.getWorkshopById(workshopId);
        if (!workshop)
            throw new common_1.NotFoundException('Workshop no encontrado');
        return workshop;
    }
};
exports.WorkshopsController = WorkshopsController;
__decorate([
    (0, common_1.Get)(':workshopId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un workshop por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'workshopId', description: 'ID del workshop' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna el workshop si se encuentra',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Workshop no encontrado',
    }),
    __param(0, (0, common_1.Param)('workshopId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkshopsController.prototype, "getWorkshopById", null);
exports.WorkshopsController = WorkshopsController = __decorate([
    (0, swagger_1.ApiTags)('Workshops'),
    (0, common_1.Controller)('workshops'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], WorkshopsController);
let ClassroomController = class ClassroomController {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async getWorkshopsByClassroom(classroomId) {
        const workshops = await this.eventsService.getWorkshopsByClassroom(classroomId);
        if (!workshops)
            throw new common_1.NotFoundException('No se encontraron workshops o classroom inexistente');
        return workshops;
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Get)(':classroomId/workshops'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los workshops asociados a un classroom' }),
    (0, swagger_1.ApiParam)({ name: 'classroomId', description: 'ID del classroom' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna la lista de workshops asociados al classroom',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classroom no encontrado o no tiene workshops',
    }),
    __param(0, (0, common_1.Param)('classroomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getWorkshopsByClassroom", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('classrooms'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], ClassroomController);
//# sourceMappingURL=events.controller.js.map