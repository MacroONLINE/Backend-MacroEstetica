import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(socket: Socket) {
    console.log(`Cliente conectado: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.log(`Cliente desconectado: ${socket.id}`);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string }
  ) {
    const canAccess = await this.chatService.canUserAccessRoom(data.roomId, data.userId);
    if (!canAccess) {
      client.emit('joinError', { error: 'No tienes acceso a esta sala' });
      return;
    }
    client.join(data.roomId);
    client.emit('joinedRoom', { roomId: data.roomId });
    console.log(`Usuario ${data.userId} se unió a la sala ${data.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; message: string }
  ) {
    const canAccess = await this.chatService.canUserAccessRoom(data.roomId, data.userId);
    if (!canAccess) {
      client.emit('messageError', { error: 'No tienes acceso a esta sala' });
      return;
    }

    // Al crear el mensaje, se incluirán los datos del usuario gracias a "include" en el ChatService
    const msg = await this.chatService.createMessage(data.roomId, data.userId, data.message);
    this.server.to(data.roomId).emit('newMessage', {
      id: msg.id,
      userId: data.userId,
      message: data.message,
      createdAt: msg.createdAt,
      // Incluimos los datos del usuario
      user: msg.user,
    });
  }
}
