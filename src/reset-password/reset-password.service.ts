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

  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuario no encontrado');

    const token = this.jwtService.sign({ email }, { expiresIn: '1h' });

    await this.prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Soporte Técnico" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `<p>Hola,</p>
             <p>Hemos recibido una solicitud para restablecer tu contraseña. Usa este enlace para crear una nueva contraseña:</p>
             <a href="${process.env.APP_URL}/reset-password/${token}">Restablecer contraseña</a>
             <p>Este enlace es válido por 1 hora.</p>`,
    });

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
