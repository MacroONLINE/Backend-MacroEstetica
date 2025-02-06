import { Injectable } from '@nestjs/common';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from 'agora-access-token';

@Injectable()
export class AgoraService {
  generateTokens(channelName: string, uid: string, role: 'host' | 'audience') {
    const appId = "30eeedb05a31430eac4d19dbe1b73ab7";
    const appCertificate = "31724ea95d98465baa793ed09a3c68f5;
    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
      appId,
      appCertificate,
      channelName,
      uid,
      agoraRole,
      privilegeExpireTime
    );
    const rtmToken = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
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
