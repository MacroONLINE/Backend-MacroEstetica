import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraController } from './agora.controller';
import { AgoraChatService } from 'src/agora-chat/agora-chat.service';
import { AgoraChatController } from 'src/agora-chat/agora-chat.controller';

@Module({
  controllers: [AgoraController, AgoraChatController],
  providers: [AgoraService, AgoraChatService],
  exports: [AgoraService, AgoraChatService],
})
export class AgoraModule {}
