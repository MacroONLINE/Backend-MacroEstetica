import { ChatService } from './chat.service';
declare class SendMessageDto {
    userId: string;
    message: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listMessages(roomId: string): Promise<{
        id: string;
        chatRoomId: string;
        userId: string;
        message: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    sendMessage(roomId: string, body: SendMessageDto): Promise<{
        id: string;
        chatRoomId: string;
        userId: string;
        message: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
