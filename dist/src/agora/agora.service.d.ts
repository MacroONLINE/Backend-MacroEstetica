export declare class AgoraService {
    generateTokens(channelName: string, uid: string, role: 'host' | 'audience'): {
        rtcToken: string;
        rtmToken: string;
        channelName: string;
        uid: string;
        role: "audience" | "host";
        expiresAt: number;
    };
}
