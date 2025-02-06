import { 
  Controller, 
  Post, 
  Body, 
  NotFoundException, 
  BadRequestException, 
  ForbiddenException 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AgoraService } from './agora.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenerateTokenDto } from './dto/generate-token.dto';

@ApiTags('Agora') // Agrupa este controlador en Swagger bajo "Agora"
@Controller('agora')
export class AgoraController {
  constructor(
    private readonly agoraService: AgoraService, 
    private readonly prisma: PrismaService
  ) {}

  @Post('generate-token')
  @ApiOperation({ 
    summary: 'Genera un token de Agora para un usuario en un stream' 
  })
  @ApiBody({
    description: 'Datos necesarios para generar el token',
    type: GenerateTokenDto,
    examples: {
      example1: {
        summary: 'Ejemplo de solicitud',
        value: {
          channelName: 'live-channel-dermatology',
          uid: 'user-12345'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token generado exitosamente',
    schema: {
      example: {
        token: '006c9be6c6b3e5f4c3...',
        channelName: 'live-channel-dermatology',
        role: 'host'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontró un stream con ese channelName',
    schema: {
      example: { statusCode: 404, message: 'No se encontró un stream con ese channelName.', error: 'Not Found' }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Errores relacionados con la fecha del stream',
    schema: {
      example: { statusCode: 400, message: 'El stream aún no ha comenzado. Inicia a las 2025-03-01T09:00:00.000Z', error: 'Bad Request' }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Usuario no autorizado para acceder al stream',
    schema: {
      example: { statusCode: 403, message: 'No tienes acceso a este stream como instructor ni como asistente registrado', error: 'Forbidden' }
    }
  })
  async generateToken(@Body() dto: GenerateTokenDto) {
    const { channelName, uid } = dto;

    const stream = await this.prisma.eventStream.findUnique({
      where: { channelName },
      include: {
        event: {
          include: {
            instructor: { select: { userId: true } },
            attendees: { select: { id: true } },
          },
        },
      },
    });

    if (!stream) {
      throw new NotFoundException('No se encontró un stream con ese channelName.');
    }

    const now = new Date();

    if (now < stream.startDateTime) {
      throw new BadRequestException(`El stream aún no ha comenzado. Inicia a las ${stream.startDateTime.toISOString()}`);
    }

    if (now > stream.endDateTime) {
      throw new BadRequestException(`El stream ya finalizó. Terminó a las ${stream.endDateTime.toISOString()}`);
    }

    const isInstructor = stream.event.instructor?.userId === uid;
    const isAttendee = stream.event.attendees.some((user) => user.id === uid);

    if (!isInstructor && !isAttendee) {
      throw new ForbiddenException('No tienes acceso a este stream como instructor ni como asistente registrado');
    }

    const role = isInstructor ? 'host' : 'audience';

    return this.agoraService.generateTokens(channelName, uid, role);
  }
}
