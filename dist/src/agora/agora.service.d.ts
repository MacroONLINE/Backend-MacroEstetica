export declare class AgoraService {
    generateTokens(channelName: string, uid: string, role: 'host' | 'audience'): {
        appId: string;
        rtcToken: string;
        rtmToken: string;
        channelName: string;
        uid: string;
        role: "audience" | "host";
        expiresAt: number;
    };
}
