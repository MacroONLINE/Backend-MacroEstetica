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
        description: string;
        userId: string | null;
        empresaId: string | null;
        productId: string | null;
        type: import(".prisma/client").$Enums.MessageType;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
