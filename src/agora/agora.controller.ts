import {
  BadRequestException,
  ForbiddenException,
  Controller,
  Post,
  Body,
  NotFoundException
} from '@nestjs/common';
import { AgoraService } from './agora.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';

@Controller('agora')
export class AgoraController {
  constructor(
    private readonly agoraService: AgoraService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate-token')
  async generateToken(@Body() dto: GenerateTokenDto) {
    const { channelName, uid } = dto;

    const stream = await this.prisma.eventStream.findUnique({
      where: { channelName },
      include: {
        event: {
          include: {
            instructor: {
              select: { userId: true },
            },
            attendees: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!stream) {
      throw new NotFoundException('No se encontró un stream con ese channelName.');
    }

    const now = new Date();
    if (now < stream.startDateTime) {
      throw new BadRequestException(
        `El stream aún no ha comenzado. Inicia a las ${stream.startDateTime.toISOString()}`
      );
    }
    if (now > stream.endDateTime) {
      throw new BadRequestException(
        `El stream ya finalizó. Terminó a las ${stream.endDateTime.toISOString()}`
      );
    }

    const isInstructor = stream.event.instructor?.userId === uid;
    const isAttendee = stream.event.attendees.some((user) => user.id === uid);

    if (!isInstructor && !isAttendee) {
      throw new ForbiddenException(
        'No tienes acceso a este stream como instructor ni como asistente registrado'
      );
    }

    const role = isInstructor ? 'host' : 'audience';

    return this.agoraService.generateRtcToken({
      channelName,
      uid,
      role,
    });
  }
}
