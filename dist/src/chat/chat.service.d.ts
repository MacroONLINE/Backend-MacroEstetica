import { PrismaService } from 'src/prisma/prisma.service';
import { ChatEntityType } from '@prisma/client';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createChatRoom(entityId: string, entityType: ChatEntityType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        entityId: string;
        entityType: import(".prisma/client").$Enums.ChatEntityType;
    }>;
    getChatRoom(entityId: string, entityType: ChatEntityType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        entityId: string;
        entityType: import(".prisma/client").$Enums.ChatEntityType;
    }>;
    createMessage(roomId: string, userId: string, message: string): Promise<{
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
    getMessages(roomId: string, limit?: number): Promise<({
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
    canUserAccessRoom(roomId: string, userId: string): Promise<boolean>;
}
