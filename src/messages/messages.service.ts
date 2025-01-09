import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    const { name, phone, email, description, userId, empresaId, productId, type } = createMessageDto;

    // Verificar si la empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: { user: true }, // Incluye la relación con el usuario de la empresa
    });

    if (!empresa) {
      throw new NotFoundException('La empresa no fue encontrada.');
    }

    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('El usuario no fue encontrado.');
    }

    // Guardar el mensaje en la base de datos
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

    // Enviar el mensaje por correo a la empresa
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const empresaEmail = empresa.user.email; // Supongamos que el correo está en el usuario relacionado con la empresa.

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

    return message;
  }
}
