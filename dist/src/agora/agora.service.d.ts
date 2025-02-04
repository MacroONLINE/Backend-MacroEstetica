import { GenerateTokenDto } from './dto/generate-token.dto';
export declare class AgoraService {
    generateRtcToken(dto: GenerateTokenDto): {
        token: string;
        channelName: string;
        uid: string;
        role: "host" | "audience";
        expiresAt: number;
    };
}
