import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const { name, phone, email, description, userId, empresaId, productId, type } = createMessageDto;

    const empresa = empresaId
      ? await this.prisma.empresa.findUnique({
          where: { id: empresaId },
          include: { user: true },
        })
      : null;

    if (empresaId && !empresa) {
      throw new NotFoundException('La empresa no fue encontrada.');
    }

    const user = userId
      ? await this.prisma.user.findUnique({
          where: { id: userId },
        })
      : null;

    if (userId && !user) {
      throw new NotFoundException('El usuario no fue encontrado.');
    }

    const message = await this.prisma.message.create({
      data: {
        name,
        phone,
        email,
        description,
        userId,
        empresaId,
        productId,
        type,
      },
    });

    if (empresa) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const empresaEmail = empresa.user.email;

      await transporter.sendMail({
        from: `"Plataforma" <${process.env.SMTP_USER}>`,
        to: empresaEmail,
        subject: `Nuevo mensaje de ${name}`,
        html: `
          <h3>Has recibido un nuevo mensaje</h3>
          <p><strong>Enviado por:</strong> ${name}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Mensaje:</strong> ${description}</p>
          ${type === 'product' && productId ? `<p><strong>ID del Producto:</strong> ${productId}</p>` : ''}
        `,
      });
    }

    return message;
  }
}
