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
exports.AgoraController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agora_service_1 = require("./agora.service");
const prisma_service_1 = require("../prisma/prisma.service");
const generate_token_dto_1 = require("./dto/generate-token.dto");
let AgoraController = class AgoraController {
    constructor(agoraService, prisma) {
        this.agoraService = agoraService;
        this.prisma = prisma;
    }
    async generateToken(dto) {
        const { uuid, uid } = dto;
        const [stream, workshop, classroom] = await this.prisma.$transaction([
            this.prisma.eventStream.findUnique({
                where: { id: uuid },
                include: { orators: { select: { userId: true } }, attendees: { select: { id: true } } },
            }),
            this.prisma.workshop.findUnique({
                where: { id: uuid },
                include: { orators: { select: { userId: true } }, attendees: { select: { id: true } } },
            }),
            this.prisma.classroom.findUnique({
                where: { id: uuid },
                include: { orators: { select: { userId: true } }, attendees: { select: { id: true } } },
            }),
        ]);
        const session = stream || workshop || classroom;
        if (!session) {
            throw new common_1.NotFoundException('No se encontró una sesión con ese UUID.');
        }
        const now = new Date();
        if (now < session.startDateTime) {
            throw new common_1.BadRequestException(`La sesión aún no ha comenzado. Inicia a las ${session.startDateTime.toISOString()}`);
        }
        if (now > session.endDateTime) {
            throw new common_1.BadRequestException(`La sesión ya finalizó. Terminó a las ${session.endDateTime.toISOString()}`);
        }
        const isInstructor = session.orators.some((orator) => orator.userId === uid);
        const isAttendee = session.attendees.some((user) => user.id === uid);
        if (!isInstructor && !isAttendee) {
            throw new common_1.ForbiddenException('No tienes acceso a esta sesión como instructor ni como asistente registrado');
        }
        const role = isInstructor ? 'host' : 'audience';
        return this.agoraService.generateTokens(uuid, uid, role);
    }
};
exports.AgoraController = AgoraController;
__decorate([
    (0, common_1.Post)('generate-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Genera un token de Agora para un usuario en un stream, workshop o classroom' }),
    (0, swagger_1.ApiBody)({
        description: 'Datos necesarios para generar el token',
        type: generate_token_dto_1.GenerateTokenDto,
        examples: {
            example1: {
                summary: 'Ejemplo de solicitud',
                value: {
                    uuid: 'd03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c',
                    uid: 'user-12345'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token generado exitosamente',
        schema: {
            example: {
                rtcToken: '006c9be6c6b3e5f4c3...',
                rtmToken: '007c9be6c6b3e5f4c3...',
                uuid: 'd03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c',
                role: 'host'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No se encontró un stream, workshop o classroom con ese UUID',
        schema: {
            example: { statusCode: 404, message: 'No se encontró una sesión con ese UUID.', error: 'Not Found' }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Errores relacionados con la fecha de la sesión',
        schema: {
            example: { statusCode: 400, message: 'La sesión aún no ha comenzado. Inicia a las 2025-03-01T09:00:00.000Z', error: 'Bad Request' }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Usuario no autorizado para acceder',
        schema: {
            example: { statusCode: 403, message: 'No tienes acceso a esta sesión como instructor ni como asistente registrado', error: 'Forbidden' }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_token_dto_1.GenerateTokenDto]),
    __metadata("design:returntype", Promise)
], AgoraController.prototype, "generateToken", null);
exports.AgoraController = AgoraController = __decorate([
    (0, swagger_1.ApiTags)('Agora'),
    (0, common_1.Controller)('agora'),
    __metadata("design:paramtypes", [agora_service_1.AgoraService,
        prisma_service_1.PrismaService])
], AgoraController);
//# sourceMappingURL=agora.controller.js.map