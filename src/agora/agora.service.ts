import { Injectable } from '@nestjs/common';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Injectable()
export class AgoraService {
  generateRtcToken(dto: GenerateTokenDto) {
    const { channelName, uid, role } = dto;
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    if (!appId || !appCertificate) {
      throw new Error('Faltan AGORA_APP_ID o AGORA_APP_CERTIFICATE en variables de entorno');
    }
    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
    const numericUid = parseInt(uid, 10);
    if (Number.isNaN(numericUid)) {
      throw new Error(`UID "${uid}" no es un número válido`);
    }
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      agoraRole,
      privilegeExpireTime,
    );
    return {
      token,
      channelName,
      uid,
      role,
      expiresAt: privilegeExpireTime,
    };
  }
}
