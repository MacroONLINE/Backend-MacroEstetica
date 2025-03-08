import { ChatService } from './chat.service';
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
    sendMessage(roomId: string, body: {
        userId: string;
        message: string;
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        chatRoomId: string;
    }>;
}
