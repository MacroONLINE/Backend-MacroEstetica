import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConfigService } from '@nestjs/config';
export declare class MessagesService {
    private readonly prisma;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createMessage(createMessageDto: CreateMessageDto): Promise<{
        userId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        description: string;
        name: string;
        empresaId: string | null;
        phone: string;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string | null;
    }>;
}
