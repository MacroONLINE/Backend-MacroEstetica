import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConfigService } from '@nestjs/config';
export declare class MessagesService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createMessage(createMessageDto: CreateMessageDto): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        userId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        empresaId: string | null;
        productId: string | null;
    }>;
}
