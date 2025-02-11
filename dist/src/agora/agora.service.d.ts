export declare class AgoraService {
    private readonly appId;
    private readonly appCertificate;
    private readonly expirationTimeInSeconds;
    generateTokens(uuid: string, uid: string, role: 'host' | 'audience'): {
        rtcToken: string;
        rtmToken: string;
        uuid: string;
        uid: string;
        role: "audience" | "host";
        expiresAt: number;
    };
}
