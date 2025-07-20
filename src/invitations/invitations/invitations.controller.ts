import { Controller, Post, Body, Param, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { InvitationsService } from './invitations.service'
import { CreateInvitesDto } from '../dto/create-invites.dto'
import { AcceptInviteDto } from '../dto/accept-invite.dto'

@ApiTags('Invitations')
@Controller('empresas/:empresaId/classrooms')
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post(':classroomId/invites')
  @ApiOperation({ summary: 'Enviar invitaciones de orador para un classroom' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'classroomId', example: 'cls_001' })
  @ApiBody({
    description: 'Lista de correos a invitar',
    type: CreateInvitesDto,
    examples: {
      sample: { value: { emails: ['dr@example.com', 'orator2@mail.com'] } },
    },
  })
  @ApiCreatedResponse({
    description: 'Invitaciones creadas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          email: { type: 'string', example: 'dr@example.com' },
          token: { type: 'string', example: 'abc123' },
          status: { type: 'string', example: 'PENDING' },
          sentAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  async sendInvites(
    @Param('classroomId') classroomId: string,
    @Body() dto: CreateInvitesDto,
  ) {
    return Promise.all(
      dto.emails.map(email => this.invitations.createInvite(classroomId, email)),
    )
  }

  @Get('invites/:token')
  @ApiOperation({ summary: 'Obtener metadata de invitación' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'token', example: 'abc123' })
  @ApiOkResponse({
    schema: {
      example: {
        email: 'dr@example.com',
        status: 'PENDING',
        classroomId: 'cls_001',
        sentAt: '2025-01-01T10:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse()
  meta(@Param('token') token: string) {
    return this.invitations.getInviteMeta(token)
  }

  @Post('invites/:token/accept')
  @ApiOperation({ summary: 'Aceptar invitación de orador' })
  @ApiParam({ name: 'empresaId', example: 'comp_001' })
  @ApiParam({ name: 'token', example: 'abc123' })
  @ApiBody({
    type: AcceptInviteDto,
    examples: { sample: { value: { userId: 'usr_001' } } },
  })
  @ApiOkResponse({
    description: 'Invitación aceptada y vínculo creado',
    schema: {
      example: {
        message: 'Invite accepted',
        classroomId: 'cls_001',
        userId: 'usr_001',
      },
    },
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  accept(
    @Param('token') token: string,
    @Body() dto: AcceptInviteDto,
  ) {
    return this.invitations.acceptInvite(token, dto.userId)
  }
}
