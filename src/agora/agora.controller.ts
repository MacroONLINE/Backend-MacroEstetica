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

@ApiTags('Agora')
@Controller('agora')
export class AgoraController {
  constructor(
    private readonly agoraService: AgoraService, 
    private readonly prisma: PrismaService
  ) {}

  /**
   * Genera un token de Agora para un usuario que accede a una sesión de tipo stream, workshop o classroom.
   * La búsqueda de la sesión se realiza utilizando el campo `channelName`.
   *
   * @example
   * // Solicitud
   * {
   *   "channelName": "d03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c",
   *   "uid": "user-12345"
   * }
   *
   * @returns Un objeto con los tokens RTC y RTM, el channelName, uid, rol y la fecha de expiración.
   *
   * @throws NotFoundException si no se encuentra un stream, workshop o classroom con ese channelName.
   * @throws BadRequestException si la sesión aún no ha comenzado o ya finalizó.
   * @throws ForbiddenException si el usuario no es instructor ni tiene un enrollment registrado en la sesión.
   */
  @Post('generate-token')
  @ApiOperation({ 
    summary: 'Genera un token de Agora para un usuario en un stream, workshop o classroom',
    description: 'El endpoint busca la sesión utilizando el campo `channelName` en lugar del `id`. El campo "channelName" del DTO representa el nombre del canal de la sesión.'
  })
  @ApiBody({
    description: 'Datos necesarios para generar el token. Nota: el campo "channelName" se utiliza para identificar la sesión.',
    type: GenerateTokenDto,
    examples: {
      example1: {
        summary: 'Ejemplo de solicitud',
        value: {
          channelName: 'd03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c',
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
        rtcToken: '006c9be6c6b3e5f4c3...',
        rtmToken: '007c9be6c6b3e5f4c3...',
        channelName: 'd03b3e6b-9f74-4d49-8e3b-9e6c6b3e5f4c',
        role: 'host'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un stream, workshop o classroom con ese channelName',
    schema: {
      example: { statusCode: 404, message: 'No se encontró una sesión con ese channelName.', error: 'Not Found' }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Errores relacionados con la fecha de la sesión',
    schema: {
      example: { statusCode: 400, message: 'La sesión aún no ha comenzado. Inicia a las 2025-03-01T09:00:00.000Z', error: 'Bad Request' }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Usuario no autorizado para acceder a la sesión',
    schema: {
      example: { statusCode: 403, message: 'No tienes acceso a esta sesión como instructor ni como usuario inscrito', error: 'Forbidden' }
    }
  })
  async generateToken(@Body() dto: GenerateTokenDto) {
    const { channelName, uid } = dto;

    // Buscar la sesión en eventStream, workshop o classroom usando el campo channelName,
    // y obtener los enrollments (inscripciones) en lugar de los asistentes.
    const [stream, workshop, classroom] = await this.prisma.$transaction([
      this.prisma.eventStream.findUnique({
        where: { channelName: channelName },
        include: { 
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } }
        },
      }),
      this.prisma.workshop.findUnique({
        where: { channelName: channelName },
        include: { 
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } }
        },
      }),
      this.prisma.classroom.findUnique({
        where: { channelName: channelName },
        include: { 
          orators: { select: { userId: true } },
          enrollments: { select: { userId: true } }
        },
      }),
    ]);

    // Determinar la sesión encontrada (puede ser de cualquiera de los tres tipos)
    const session = stream || workshop || classroom;

    if (!session) {
      throw new NotFoundException('No se encontró una sesión con ese channelName.');
    }

    const now = new Date();
    
    if (now < session.startDateTime) {
      throw new BadRequestException(`La sesión aún no ha comenzado. Inicia a las ${session.startDateTime.toISOString()}`);
    }

    if (now > session.endDateTime) {
      throw new BadRequestException(`La sesión ya finalizó. Terminó a las ${session.endDateTime.toISOString()}`);
    }

    const isInstructor = session.orators.some((orator) => orator.userId === uid);
    const isEnrolled = session.enrollments.some((enrollment) => enrollment.userId === uid);

    if (!isInstructor && !isEnrolled) {
      throw new ForbiddenException('No tienes acceso a esta sesión como instructor ni como usuario inscrito');
    }

    const role = isInstructor ? 'host' : 'audience';

    // Se utiliza el channelName para generar los tokens
    return this.agoraService.generateTokens(channelName, uid, role);
  }
}
