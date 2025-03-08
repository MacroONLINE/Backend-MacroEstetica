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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const chat_service_1 = require("./chat.service");
class SendMessageDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user-12345',
        description: 'ID del usuario que envía el mensaje',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Hola, ¿cómo están?',
        description: 'Contenido del mensaje',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "message", void 0);
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async listMessages(roomId) {
        return this.chatService.getMessages(roomId, 50);
    }
    async sendMessage(roomId, body) {
        const canAccess = await this.chatService.canUserAccessRoom(roomId, body.userId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('No tienes acceso a esta sala');
        }
        return this.chatService.createMessage(roomId, body.userId, body.message);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)(':roomId/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene los últimos 50 mensajes de una sala de chat',
        description: 'Retorna un array con los mensajes más recientes en la sala indicada.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'roomId',
        description: 'ID de la sala de chat',
        example: 'room-001',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de mensajes en la sala',
        schema: {
            example: [
                {
                    id: 'msg-001',
                    userId: 'user-12345',
                    message: 'Hola, ¿cómo están?',
                    createdAt: '2025-03-08T12:30:00.000Z',
                },
                {
                    id: 'msg-002',
                    userId: 'user-67890',
                    message: 'Bien, ¿y tú?',
                    createdAt: '2025-03-08T12:31:00.000Z',
                },
            ],
        },
    }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Post)(':roomId/messages'),
    (0, swagger_1.ApiOperation)({
        summary: 'Envía un nuevo mensaje a una sala de chat',
        description: 'El usuario debe estar inscrito o tener acceso a la sala para poder enviar mensajes.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'roomId',
        description: 'ID de la sala de chat donde se enviará el mensaje',
        example: 'room-001',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Información del mensaje que se enviará',
        type: SendMessageDto,
        examples: {
            ejemplo1: {
                summary: 'Mensaje estándar',
                value: {
                    userId: 'user-12345',
                    message: 'Hola, ¿cómo están?',
                },
            },
            ejemplo2: {
                summary: 'Mensaje largo',
                value: {
                    userId: 'user-67890',
                    message: 'Esto es un mensaje más largo con múltiples palabras y detalles adicionales.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Mensaje creado correctamente',
        schema: {
            example: {
                id: 'msg-003',
                roomId: 'room-001',
                userId: 'user-12345',
                message: 'Hola, ¿cómo están?',
                createdAt: '2025-03-08T12:32:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'El usuario no tiene acceso a la sala',
        schema: {
            example: {
                statusCode: 403,
                message: 'No tienes acceso a esta sala',
                error: 'Forbidden',
            },
        },
    }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map