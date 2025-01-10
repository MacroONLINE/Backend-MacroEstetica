import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
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
