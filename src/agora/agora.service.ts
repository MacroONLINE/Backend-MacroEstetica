// agora.service.ts
import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';

@Injectable()
export class AgoraService {
  private readonly appId = '30eeedb05a31430eac4d19dbe1b73ab7';
  private readonly appCertificate = '31724ea95d98465baa793ed09a3c68f5';
  private readonly expirationTimeInSeconds = 3600;

  generateTokens(channelName: string, uid: string, role: 'host' | 'audience') {
    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + this.expirationTimeInSeconds;
    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
      this.appId,
      this.appCertificate,
      channelName,
      uid,
      agoraRole,
      privilegeExpireTime
    );
    const rtmToken = RtmTokenBuilder.buildToken(
      this.appId,
      this.appCertificate,
      uid,
      RtmRole.Rtm_User,
      privilegeExpireTime
    );
    return {
      rtcToken,
      rtmToken,
      channelName,
      uid,
      role,
      expiresAt: privilegeExpireTime,
    };
  }
}
