// src/reset-password/reset-password.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

function trimSlash(s: string) {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private createTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuario no encontrado');

    const expiresInSec = 60 * 60; // 1h
    const token = this.jwtService.sign({ email }, { expiresIn: expiresInSec });
    const expiresAt = new Date(Date.now() + expiresInSec * 1000);

    await this.prisma.passwordReset.create({
      data: { email, token, expiresAt },
    });

    const transporter = this.createTransport();
    await transporter.verify();

    const frontendBase =
      trimSlash(process.env.FRONTEND_URL || process.env.NEXTAUTH_URL || 'https://macroestetica.com');

    const resetUrl = `${frontendBase}/reset-password/${encodeURIComponent(token)}`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.firstName ?? ''},</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
        <p>Usa este enlace para crear una nueva contraseña (válido por 1 hora):</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Si no fuiste tú, ignora este mensaje.</p>
      `,
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRequest = await this.prisma.passwordReset.findUnique({ where: { token } });
    if (!resetRequest || new Date() > resetRequest.expiresAt) {
      throw new Error('Token inválido o expirado');
    }

    const user = await this.prisma.user.findUnique({ where: { email: resetRequest.email } });
    if (!user) throw new Error('Usuario no encontrado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordReset.delete({ where: { token } });
  }
}
