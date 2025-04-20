import { ChatService } from './chat.service';
declare class SendMessageDto {
    userId: string;
    message: string;
}
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listMessages(roomId: string): Promise<({
        user: {
            firstName: string;
            lastName: string;
            profileImageUrl: string;
        };
    } & {
        message: string;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chatRoomId: string;
    })[]>;
    sendMessage(roomId: string, body: SendMessageDto): Promise<{
        user: {
            firstName: string;
            lastName: string;
            profileImageUrl: string;
        };
    } & {
        message: string;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chatRoomId: string;
    }>;
}
export {};
