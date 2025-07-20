import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations/invitations.service';
import { InvitationsController } from './invitations/invitations.controller';

@Module({
  providers: [InvitationsService],
  controllers: [InvitationsController]
})
export class InvitationsModule {}
