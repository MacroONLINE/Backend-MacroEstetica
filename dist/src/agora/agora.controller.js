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
        const { channelName, uid } = dto;
        const [stream, workshop, classroom] = await this.prisma.$transaction([
            this.prisma.eventStream.findUnique({
                where: { channelName },
                include: {
                    orators: { select: { userId: true } },
                    enrollments: { select: { userId: true } },
                },
            }),
            this.prisma.workshop.findUnique({
                where: { channelName },
                include: {
                    orators: { select: { userId: true } },
                    enrollments: { select: { userId: true } },
                },
            }),
            this.prisma.classroom.findUnique({
                where: { channelName },
                include: {
                    orators: { select: { userId: true } },
                    enrollments: { select: { userId: true } },
                },
            }),
        ]);
        const session = stream || workshop || classroom;
        if (!session) {
            throw new common_1.NotFoundException('No se encontró una sesión con ese channelName.');
        }
        const now = new Date();
        if (now < session.startDateTime) {
            throw new common_1.BadRequestException(`La sesión aún no ha comenzado. Inicia a las ${session.startDateTime.toISOString()}`);
        }
        if (now > session.endDateTime) {
            throw new common_1.BadRequestException(`La sesión ya finalizó. Terminó a las ${session.endDateTime.toISOString()}`);
        }
        const isInstructor = session.orators.some((o) => o.userId === uid);
        const isEnrolled = session.enrollments.some((e) => e.userId === uid);
        if (!isInstructor && !isEnrolled) {
            throw new common_1.ForbiddenException('No tienes acceso a esta sesión como instructor ni como usuario inscrito');
        }
        const role = isInstructor ? 'host' : 'audience';
        const tokens = this.agoraService.generateTokens(channelName, uid, role);
        let entityType;
        if (stream)
            entityType = 'STREAM';
        else if (workshop)
            entityType = 'WORKSHOP';
        else
            entityType = 'CLASSROOM';
        const chatRoom = await this.prisma.chatRoom.findFirst({
            where: { entityId: session.id, entityType },
        });
        const roomId = chatRoom ? chatRoom.id : null;
        return { ...tokens, roomId };
    }
    async getRoomId(channelName) {
        const [stream, workshop, classroom] = await this.prisma.$transaction([
            this.prisma.eventStream.findUnique({ where: { channelName } }),
            this.prisma.workshop.findUnique({ where: { channelName } }),
            this.prisma.classroom.findUnique({ where: { channelName } }),
        ]);
        const entity = stream || workshop || classroom;
        if (!entity) {
            throw new common_1.NotFoundException('No se encontró una sesión con ese channelName.');
        }
        let entityType;
        if (stream)
            entityType = 'STREAM';
        else if (workshop)
            entityType = 'WORKSHOP';
        else
            entityType = 'CLASSROOM';
        const chatRoom = await this.prisma.chatRoom.findFirst({
            where: { entityId: entity.id, entityType },
        });
        if (!chatRoom) {
            throw new common_1.NotFoundException('No se encontró ChatRoom asociado a esa sesión.');
        }
        return { roomId: chatRoom.id };
    }
};
exports.AgoraController = AgoraController;
__decorate([
    (0, common_1.Post)('generate-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Genera un token de Agora para un usuario en un stream, workshop o classroom' }),
    (0, swagger_1.ApiBody)({
        description: 'Datos necesarios para generar el token, usando "channelName" para identificar la sesión.',
        type: generate_token_dto_1.GenerateTokenDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token generado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró un stream, workshop o classroom con ese channelName' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Errores relacionados con la fecha de la sesión' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Usuario no autorizado para acceder a la sesión' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_token_dto_1.GenerateTokenDto]),
    __metadata("design:returntype", Promise)
], AgoraController.prototype, "generateToken", null);
__decorate([
    (0, common_1.Get)(':channelName/room-id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retorna el roomId de chat para un channelName asociado a stream, workshop o classroom',
    }),
    (0, swagger_1.ApiParam)({ name: 'channelName', description: 'Nombre del canal (coincide con la sesión buscada)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna el roomId si existe' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró la sesión o la sala de chat' }),
    __param(0, (0, common_1.Param)('channelName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AgoraController.prototype, "getRoomId", null);
exports.AgoraController = AgoraController = __decorate([
    (0, swagger_1.ApiTags)('Agora'),
    (0, common_1.Controller)('agora'),
    __metadata("design:paramtypes", [agora_service_1.AgoraService,
        prisma_service_1.PrismaService])
], AgoraController);
//# sourceMappingURL=agora.controller.js.map