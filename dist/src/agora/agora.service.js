"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgoraService = void 0;
const common_1 = require("@nestjs/common");
const agora_access_token_1 = require("agora-access-token");
let AgoraService = class AgoraService {
    generateRtcToken(dto) {
        const { channelName, uid, role } = dto;
        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        if (!appId || !appCertificate) {
            throw new Error('Faltan AGORA_APP_ID o AGORA_APP_CERTIFICATE en variables de entorno');
        }
        const agoraRole = role === 'host' ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
        const numericUid = parseInt(uid, 10);
        if (Number.isNaN(numericUid)) {
            throw new Error(`UID "${uid}" no es un número válido`);
        }
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, numericUid, agoraRole, privilegeExpireTime);
        return {
            token,
            channelName,
            uid,
            role,
            expiresAt: privilegeExpireTime,
        };
    }
};
exports.AgoraService = AgoraService;
exports.AgoraService = AgoraService = __decorate([
    (0, common_1.Injectable)()
], AgoraService);
//# sourceMappingURL=agora.service.js.map