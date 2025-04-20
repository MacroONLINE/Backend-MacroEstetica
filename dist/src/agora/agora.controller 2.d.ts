import { AgoraService } from './agora.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
export declare class AgoraController {
    private readonly agoraService;
    private readonly prisma;
    constructor(agoraService: AgoraService, prisma: PrismaService);
    generateToken(dto: GenerateTokenDto): Promise<any>;
    getRoomId(channelName: string): Promise<{
        roomId: string;
    }>;
}
