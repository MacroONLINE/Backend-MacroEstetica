import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatEntityType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChatRoom(entityId: string, entityType: ChatEntityType) {
    return this.prisma.chatRoom.create({
      data: { entityId, entityType },
    });
  }

  async getChatRoom(entityId: string, entityType: ChatEntityType) {
    return this.prisma.chatRoom.findFirst({
      where: { entityId, entityType },
    });
  }

  async createMessage(roomId: string, userId: string, message: string) {
    return this.prisma.chatMessage.create({
      data: { chatRoomId: roomId, userId, message },
    });
  }

  async getMessages(roomId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async canUserAccessRoom(roomId: string, userId: string): Promise<boolean> {
    const room = await this.prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Sala de chat no encontrada');

    switch (room.entityType) {
      case 'STREAM':
        return !!(await this.prisma.eventStreamEnrollment.findFirst({
          where: { eventStreamId: room.entityId, userId },
        }));

      case 'WORKSHOP':
        return !!(await this.prisma.workshopEnrollment.findFirst({
          where: { workshopId: room.entityId, userId },
        }));

      case 'CLASSROOM':
        return !!(await this.prisma.classroomEnrollment.findFirst({
          where: { classroomId: room.entityId, userId },
        }));

      default:
        return false;
    }
  }
}
