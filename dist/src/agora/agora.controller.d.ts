import { AgoraService } from './agora.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
export declare class AgoraController {
    private readonly agoraService;
    private readonly prisma;
    constructor(agoraService: AgoraService, prisma: PrismaService);
    generateToken(dto: GenerateTokenDto): Promise<{
        rtcToken: string;
        rtmToken: string;
        channelName: string;
        uid: string;
        role: "host" | "audience";
        expiresAt: number;
    }>;
}
