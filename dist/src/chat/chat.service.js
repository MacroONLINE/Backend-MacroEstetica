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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createChatRoom(entityId, entityType) {
        return this.prisma.chatRoom.create({
            data: { entityId, entityType },
        });
    }
    async getChatRoom(entityId, entityType) {
        return this.prisma.chatRoom.findFirst({
            where: { entityId, entityType },
        });
    }
    async createMessage(roomId, userId, message) {
        return this.prisma.chatMessage.create({
            data: { chatRoomId: roomId, userId, message },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true
                    },
                },
            },
        });
    }
    async getMessages(roomId, limit = 50) {
        return this.prisma.chatMessage.findMany({
            where: { chatRoomId: roomId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profileImageUrl: true
                    },
                },
            },
        });
    }
    async canUserAccessRoom(roomId, userId) {
        const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
        if (!room)
            throw new common_1.NotFoundException('Sala de chat no encontrada');
        switch (room.entityType) {
            case 'STREAM':
                return !!(await this.prisma.eventStreamEnrollment.findFirst({
                    where: { eventStreamId: room.entityId, userId },
                }));
            case 'WORKSHOP':
                return !!(await this.prisma.workshopEnrollment.findFirst({
                    where: { workshopId: room.entityId, userId },
                }));
            case 'CLASSROOM':
                return !!(await this.prisma.classroomEnrollment.findFirst({
                    where: { classroomId: room.entityId, userId },
                }));
            default:
                return false;
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map