import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto) {

    console.log('Environment Variables:', {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_SECURE: process.env.SMTP_SECURE,
      });
      
    const {
      name,
      phone,
      email,
      description,
      userId,
      empresaId,
      productId,
      type
    } = createMessageDto;

    // Verificar si la empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) {
      throw new NotFoundException('La empresa no fue encontrada.');
    }

    // Verificar si el usuario que está enviando el mensaje existe
    // (si es que viene un userId en el dto)
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('El usuario que envía el mensaje no fue encontrado.');
      }
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
        type, // Importante: agregar el tipo al crear el mensaje
      },
    });

    // Obtener el usuario que maneja la empresa, para obtener su correo
    const empresaUser = await this.prisma.user.findUnique({
      where: { id: empresa.userId },
    });

    if (!empresaUser) {
      throw new NotFoundException(
        'No se encontró el usuario administrador de la empresa.'
      );
    }

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Enviar el mensaje por correo al email del usuario que maneja la empresa
    await transporter.sendMail({
      from: `"Plataforma" <${process.env.SMTP_USER}>`,
      to: empresaUser.email,
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <h3>Has recibido un nuevo mensaje</h3>
        <p><strong>Enviado por:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${description}</p>
      `,
    });

    return message;
  }
}
