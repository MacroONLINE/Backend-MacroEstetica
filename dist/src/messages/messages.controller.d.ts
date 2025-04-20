import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
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
