import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AgoraChatService } from './agora-chat.service';
import { CreateUserTokenDto } from './dto/create-user-token.dto';

@ApiTags('Agora Chat')
@Controller('agora-chat')
export class AgoraChatController {
  constructor(private readonly chatService: AgoraChatService) {}

  @Post('create-user-token')
  @ApiOperation({ summary: 'Crea el usuario en Agora Chat si no existe y devuelve su token' })
  @ApiBody({
    description: 'DTO con el userId del usuario',
    type: CreateUserTokenDto,
    examples: {
      ejemplo1: {
        summary: 'Solicitud válida',
        value: { userId: 'user-001' },
      },
    },
  })
  async createOrGetUserToken(@Body() body: CreateUserTokenDto) {
    return this.chatService.createOrGetUserToken(body.userId);
  }
}
