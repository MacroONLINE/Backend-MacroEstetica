"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgoraModule = void 0;
const common_1 = require("@nestjs/common");
const agora_service_1 = require("./agora.service");
const agora_controller_1 = require("./agora.controller");
const agora_chat_service_1 = require("../agora-chat/agora-chat.service");
const agora_chat_controller_1 = require("../agora-chat/agora-chat.controller");
let AgoraModule = class AgoraModule {
};
exports.AgoraModule = AgoraModule;
exports.AgoraModule = AgoraModule = __decorate([
    (0, common_1.Module)({
        controllers: [agora_controller_1.AgoraController, agora_chat_controller_1.AgoraChatController],
        providers: [agora_service_1.AgoraService, agora_chat_service_1.AgoraChatService],
        exports: [agora_service_1.AgoraService, agora_chat_service_1.AgoraChatService],
    })
], AgoraModule);
//# sourceMappingURL=agora.module.js.map