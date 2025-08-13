import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

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
      secure: process.env.SMTP_SECURE === 'true', // true solo si 465
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

    // 1) Genera JWT y calcula expiración coherente con expiresAt
    const expiresInSec = 60 * 60; // 1h
    const token = this.jwtService.sign({ email }, { expiresIn: expiresInSec });
    const expiresAt = new Date(Date.now() + expiresInSec * 1000);

    // 2) Crea el registro antes de enviar
    await this.prisma.passwordReset.create({
      data: { email, token, expiresAt },
    });

    const transporter = this.createTransport();

    try {
      // 3) Verifica el transporte (útil en prod)
      await transporter.verify();

      const resetUrl = `${process.env.APP_URL}/reset-password/${encodeURIComponent(
        token,
      )}`;

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
    } catch (err) {
      // Si falla el envío, limpia el token creado y propaga error
      await this.prisma.passwordReset.delete({ where: { token } });
      throw err;
    }

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetRequest = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRequest || new Date() > resetRequest.expiresAt) {
      throw new Error('Token inválido o expirado');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: resetRequest.email },
    });
    if (!user) throw new Error('Usuario no encontrado');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordReset.delete({ where: { token } });
  }
}
