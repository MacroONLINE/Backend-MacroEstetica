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
exports.AgoraChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agora_chat_service_1 = require("./agora-chat.service");
const create_user_token_dto_1 = require("./dto/create-user-token.dto");
let AgoraChatController = class AgoraChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createOrGetUserToken(body) {
        return this.chatService.createOrGetUserToken(body.userId);
    }
};
exports.AgoraChatController = AgoraChatController;
__decorate([
    (0, common_1.Post)('create-user-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Crea el usuario en Agora Chat si no existe y devuelve su token' }),
    (0, swagger_1.ApiBody)({
        description: 'DTO con el userId del usuario',
        type: create_user_token_dto_1.CreateUserTokenDto,
        examples: {
            ejemplo1: {
                summary: 'Solicitud válida',
                value: { userId: 'user-001' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_token_dto_1.CreateUserTokenDto]),
    __metadata("design:returntype", Promise)
], AgoraChatController.prototype, "createOrGetUserToken", null);
exports.AgoraChatController = AgoraChatController = __decorate([
    (0, swagger_1.ApiTags)('Agora Chat'),
    (0, common_1.Controller)('agora-chat'),
    __metadata("design:paramtypes", [agora_chat_service_1.AgoraChatService])
], AgoraChatController);
//# sourceMappingURL=agora-chat.controller.js.map