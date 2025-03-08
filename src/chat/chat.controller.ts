import { Controller, Get, Post, Param, Body, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId/messages')
  @ApiOperation({ summary: 'Obtiene los últimos 50 mensajes de una sala de chat' })
  @ApiResponse({ status: 200, description: 'Arreglo de mensajes' })
  async listMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId, 50);
  }

  @Post(':roomId/messages')
  @ApiOperation({ summary: 'Crea un nuevo mensaje en la sala de chat' })
  @ApiResponse({ status: 201, description: 'Mensaje creado correctamente' })
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: { userId: string; message: string },
  ) {
    const canAccess = await this.chatService.canUserAccessRoom(roomId, body.userId);
    if (!canAccess) {
      throw new ForbiddenException('No tienes acceso a esta sala');
    }
    return this.chatService.createMessage(roomId, body.userId, body.message);
  }
}
