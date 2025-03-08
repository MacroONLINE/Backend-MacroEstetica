import { Controller, Get, Post, Param, Body, ForbiddenException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { ChatService } from './chat.service';

class SendMessageDto {
  @ApiProperty({
    example: 'user-12345',
    description: 'ID del usuario que envía el mensaje',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'Hola, ¿cómo están?',
    description: 'Contenido del mensaje',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId/messages')
  @ApiOperation({
    summary: 'Obtiene los últimos 50 mensajes de una sala de chat',
    description: 'Retorna un array con los mensajes más recientes en la sala indicada.',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la sala de chat',
    example: 'room-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mensajes en la sala',
    schema: {
      example: [
        {
          id: 'msg-001',
          userId: 'user-12345',
          message: 'Hola, ¿cómo están?',
          createdAt: '2025-03-08T12:30:00.000Z',
        },
        {
          id: 'msg-002',
          userId: 'user-67890',
          message: 'Bien, ¿y tú?',
          createdAt: '2025-03-08T12:31:00.000Z',
        },
      ],
    },
  })
  async listMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId, 50);
  }

  @Post(':roomId/messages')
  @ApiOperation({
    summary: 'Envía un nuevo mensaje a una sala de chat',
    description: 'El usuario debe estar inscrito o tener acceso a la sala para poder enviar mensajes.',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID de la sala de chat donde se enviará el mensaje',
    example: 'room-001',
  })
  @ApiBody({
    description: 'Información del mensaje que se enviará',
    type: SendMessageDto,
    examples: {
      ejemplo1: {
        summary: 'Mensaje estándar',
        value: {
          userId: 'user-12345',
          message: 'Hola, ¿cómo están?',
        },
      },
      ejemplo2: {
        summary: 'Mensaje largo',
        value: {
          userId: 'user-67890',
          message: 'Esto es un mensaje más largo con múltiples palabras y detalles adicionales.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Mensaje creado correctamente',
    schema: {
      example: {
        id: 'msg-003',
        roomId: 'room-001',
        userId: 'user-12345',
        message: 'Hola, ¿cómo están?',
        createdAt: '2025-03-08T12:32:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'El usuario no tiene acceso a la sala',
    schema: {
      example: {
        statusCode: 403,
        message: 'No tienes acceso a esta sala',
        error: 'Forbidden',
      },
    },
  })
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: SendMessageDto,
  ) {
    const canAccess = await this.chatService.canUserAccessRoom(roomId, body.userId);
    if (!canAccess) {
      throw new ForbiddenException('No tienes acceso a esta sala');
    }
    return this.chatService.createMessage(roomId, body.userId, body.message);
  }
}
