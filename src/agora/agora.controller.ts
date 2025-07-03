import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AgoraService } from './agora.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { ChatEntityType } from '@prisma/client';

@ApiTags('Agora')
@Controller('agora')
export class AgoraController {
  constructor(
    private readonly agoraService: AgoraService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('generate-token')
  @ApiOperation({ summary: 'Genera un token de Agora para un usuario en un stream, workshop o classroom' })
  @ApiBody({
    description: 'Datos necesarios para generar el token, usando "channelName" para identificar la sesión.',
    type: GenerateTokenDto,
  })
  @ApiResponse({ status: 200, description: 'Token generado exitosamente' })
  @ApiResponse({ status: 404, description: 'No se encontró un stream, workshop o classroom con ese channelName' })
  @ApiResponse({ status: 400, description: 'Errores relacionados con la fecha de la sesión' })
  @ApiResponse({ status: 403, description: 'Usuario no autorizado para acceder a la sesión' })
  async generateToken(@Body() dto: GenerateTokenDto) {
    const { channelName, uid } = dto;
    const [stream, workshop, classroom] = await this.prisma.$transaction([
      this.prisma.eventStream.findUnique({
        where: { channelName },
        include: {
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } },
        },
      }),
      this.prisma.workshop.findUnique({
        where: { channelName },
        include: {
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } },
        },
      }),
      this.prisma.classroom.findUnique({
        where: { channelName },
        include: {
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } },
        },
      }),
    ]);

    const session = stream || workshop || classroom;
    if (!session) {
      throw new NotFoundException('No se encontró una sesión con ese channelName.');
    }

    const now = new Date();
    if (now < session.startDateTime) {
      throw new BadRequestException(
        `La sesión aún no ha comenzado. Inicia a las ${session.startDateTime.toISOString()}`,
      );
    }
    if (now > session.endDateTime) {
      throw new BadRequestException(
        `La sesión ya finalizó. Terminó a las ${session.endDateTime.toISOString()}`,
      );
    }

    const isInstructor = session.orators.some((o) => o.userId === uid);
    const isEnrolled = session.enrollments.some((e) => e.userId === uid);
    if (!isInstructor && !isEnrolled) {
      throw new ForbiddenException('No tienes acceso a esta sesión como instructor ni como usuario inscrito');
    }

    const role = isInstructor ? 'host' : 'audience';
    const tokens = this.agoraService.generateTokens(channelName, uid, role);

    let entityType: ChatEntityType;
    if (stream) entityType = 'STREAM';
    else if (workshop) entityType = 'WORKSHOP';
    else entityType = 'CLASSROOM';

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: { entityId: session.id, entityType },
    });

    const roomId = chatRoom ? chatRoom.id : null;
    return { ...tokens, roomId };
  }

  @Get(':channelName/room-id')
  @ApiOperation({
    summary: 'Retorna el roomId de chat para un channelName asociado a stream, workshop o classroom',
  })
  @ApiParam({ name: 'channelName', description: 'Nombre del canal (coincide con la sesión buscada)' })
  @ApiResponse({ status: 200, description: 'Retorna el roomId si existe' })
  @ApiResponse({ status: 404, description: 'No se encontró la sesión o la sala de chat' })
  async getRoomId(@Param('channelName') channelName: string) {
    const [stream, workshop, classroom] = await this.prisma.$transaction([
      this.prisma.eventStream.findUnique({ where: { channelName } }),
      this.prisma.workshop.findUnique({ where: { channelName } }),
      this.prisma.classroom.findUnique({ where: { channelName } }),
    ]);

    const entity = stream || workshop || classroom;
    if (!entity) {
      throw new NotFoundException('No se encontró una sesión con ese channelName.');
    }

    let entityType: ChatEntityType;
    if (stream) entityType = 'STREAM';
    else if (workshop) entityType = 'WORKSHOP';
    else entityType = 'CLASSROOM';

    const chatRoom = await this.prisma.chatRoom.findFirst({
      where: { entityId: entity.id, entityType },
    });

    if (!chatRoom) {
      throw new NotFoundException('No se encontró ChatRoom asociado a esa sesión.');
    }

    return { roomId: chatRoom.id };
  }
}
