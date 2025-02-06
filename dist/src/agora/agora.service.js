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
    generateTokens(channelName, uid, role) {
        const appId = "30eeedb05a31430eac4d19dbe1b73ab7";
        const appCertificate = "31724ea95d98465baa793ed09a3c68f5";
        const agoraRole = role === 'host' ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
        const rtmToken = agora_access_token_1.RtcTokenBuilder.buildTokenWithAccount(appId, appCertificate, channelName, uid, agoraRole, privilegeExpireTime);
        const rtcToken = agora_access_token_1.RtmTokenBuilder.buildToken(appId, appCertificate, uid, agora_access_token_1.RtmRole.Rtm_User, privilegeExpireTime);
        return {
            rtcToken,
            rtmToken,
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