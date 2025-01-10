"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MessagesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MessagesService = MessagesService_1 = class MessagesService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(MessagesService_1.name);
    }
    async createMessage(createMessageDto) {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpPort = this.configService.get('SMTP_PORT');
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');
        const smtpSecure = this.configService.get('SMTP_SECURE');
        this.logger.debug('Environment Variables from ConfigService:', {
            SMTP_HOST: smtpHost,
            SMTP_PORT: smtpPort,
            SMTP_USER: smtpUser,
            SMTP_PASS: smtpPass,
            SMTP_SECURE: smtpSecure,
        });
        const { name, phone, email, description, userId, empresaId, productId, type, } = createMessageDto;
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: empresaId },
        });
        if (!empresa) {
            throw new common_1.NotFoundException('La empresa no fue encontrada.');
        }
        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('El usuario que envía el mensaje no fue encontrado.');
            }
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
        const empresaUser = await this.prisma.user.findUnique({
            where: { id: empresa.userId },
        });
        if (!empresaUser) {
            throw new common_1.NotFoundException('No se encontró el usuario administrador de la empresa.');
        }
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort, 10),
            secure: smtpSecure === 'true',
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = MessagesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map