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
const chat_service_1 = require("./chat.service");
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
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene los últimos 50 mensajes de una sala de chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Arreglo de mensajes' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Post)(':roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo mensaje en la sala de chat' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mensaje creado correctamente' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map