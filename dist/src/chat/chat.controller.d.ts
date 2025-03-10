import { ChatService } from './chat.service';
declare class SendMessageDto {
    userId: string;
    message: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listMessages(roomId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        chatRoomId: string;
    }[]>;
    sendMessage(roomId: string, body: SendMessageDto): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        chatRoomId: string;
    }>;
}
export {};
