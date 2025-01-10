import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    // Obtener las variables de entorno desde ConfigService
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<string>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<string>('SMTP_SECURE');

    // Imprimir las variables de entorno para corroborar
    this.logger.debug('Environment Variables from ConfigService:', {
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_USER: smtpUser,
      SMTP_PASS: smtpPass,
      SMTP_SECURE: smtpSecure,
    });

    const {
      name,
      phone,
      email,
      description,
      userId,
      empresaId,
      productId,
      type,
    } = createMessageDto;

    // Verificar si la empresa existe
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) {
      throw new NotFoundException('La empresa no fue encontrada.');
    }

    // Verificar si el usuario que está enviando el mensaje existe (si viene userId)
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          'El usuario que envía el mensaje no fue encontrado.',
        );
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
        type, // Se incluye el tipo al crear el registro
      },
    });

    // Obtener el usuario que maneja la empresa, para obtener su correo
    const empresaUser = await this.prisma.user.findUnique({
      where: { id: empresa.userId },
    });

    if (!empresaUser) {
      throw new NotFoundException(
        'No se encontró el usuario administrador de la empresa.',
      );
    }

    // Configurar Nodemailer usando las variables de entorno
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpSecure === 'true', // true para 465, false para otros puertos
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Enviar el mensaje por correo al email del usuario que maneja la empresa
    await transporter.sendMail({
      from: `"Plataforma" <${smtpUser}>`,
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
