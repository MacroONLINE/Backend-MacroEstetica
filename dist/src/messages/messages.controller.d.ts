import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
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
