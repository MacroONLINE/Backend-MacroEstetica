import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createMessage(createMessageDto: CreateMessageDto): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MessageType;
        userId: string | null;
        description: string;
        empresaId: string | null;
        productId: string | null;
    }>;
}
