import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { randomBytes } from 'crypto'
import * as nodemailer from 'nodemailer'
import { inviteHtml } from '../email-template'

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createInvite(classroomId: string, email: string) {
    const token = randomBytes(24).toString('hex')
    const invite = await this.prisma.classroomOratorInvite.create({
      data: { classroomId, email: email.toLowerCase(), token },
    })
    await this.sendMail(invite)
    return invite
  }

  async acceptInvite(token: string, userId: string) {
    const invite = await this.prisma.classroomOratorInvite.findUnique({
      where: { token },
    })
    if (!invite || invite.status !== 'PENDING') throw new BadRequestException()
    const limit = 1000 * 60 * 60 * 48
    if (Date.now() - invite.sentAt.getTime() > limit) throw new BadRequestException()
    await this.prisma.$transaction([
      this.prisma.classroomOratorInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedAt: new Date(), userId },
      }),
      this.prisma.classroom.update({
        where: { id: invite.classroomId },
        data: { orators: { connect: { userId } } },
      }),
    ])
    return { ok: true }
  }

  async getInviteMeta(token: string) {
    return this.prisma.classroomOratorInvite.findUnique({
      where: { token },
      select: {
        email: true,
        status: true,
        classroomId: true,
        sentAt: true,
      },
    })
  }

  private async sendMail(invite: { email: string; token: string; classroomId: string }) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: invite.classroomId },
    })
    const link = `${this.config.get('APP_URL')}/invites/${invite.token}`
    const transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: parseInt(this.config.get('SMTP_PORT'), 10),
      secure: this.config.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    })
    await transporter.sendMail({
      from: `"Plataforma" <${this.config.get('SMTP_USER')}>`,
      to: invite.email,
      subject: 'Invitación como orador',
      html: inviteHtml(link, classroom?.title || ''),
    })
  }
}
