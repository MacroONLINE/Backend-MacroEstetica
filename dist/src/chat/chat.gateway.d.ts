import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    joinRoom(client: Socket, data: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleMessage(client: Socket, data: {
        roomId: string;
        userId: string;
        message: string;
    }): Promise<void>;
}
