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
        const stream = await this.prisma.eventStream.findUnique({
            where: { channelName },
            include: {
                event: {
                    include: {
                        instructor: {
                            select: { userId: true },
                        },
                        attendees: {
                            select: { id: true },
                        },
                    },
                },
            },
        });
        if (!stream) {
            throw new common_1.NotFoundException('No se encontró un stream con ese channelName.');
        }
        const now = new Date();
        if (now < stream.startDateTime) {
            throw new common_1.BadRequestException(`El stream aún no ha comenzado. Inicia a las ${stream.startDateTime.toISOString()}`);
        }
        if (now > stream.endDateTime) {
            throw new common_1.BadRequestException(`El stream ya finalizó. Terminó a las ${stream.endDateTime.toISOString()}`);
        }
        const isInstructor = stream.event.instructor?.userId === uid;
        const isAttendee = stream.event.attendees.some((user) => user.id === uid);
        if (!isInstructor && !isAttendee) {
            throw new common_1.ForbiddenException('No tienes acceso a este stream como instructor ni como asistente registrado');
        }
        const role = isInstructor ? 'host' : 'audience';
        return this.agoraService.generateRtcToken({
            channelName,
            uid,
            role,
        });
    }
};
exports.AgoraController = AgoraController;
__decorate([
    (0, common_1.Post)('generate-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_token_dto_1.GenerateTokenDto]),
    __metadata("design:returntype", Promise)
], AgoraController.prototype, "generateToken", null);
exports.AgoraController = AgoraController = __decorate([
    (0, common_1.Controller)('agora'),
    __metadata("design:paramtypes", [agora_service_1.AgoraService,
        prisma_service_1.PrismaService])
], AgoraController);
//# sourceMappingURL=agora.controller.js.map