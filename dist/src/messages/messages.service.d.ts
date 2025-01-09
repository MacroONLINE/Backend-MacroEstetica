import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createMessage(createMessageDto: CreateMessageDto): Promise<{
        name: string;
        id: string;
        phone: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        userId: string;
        description: string;
        empresaId: string;
        productId: string | null;
    }>;
}
