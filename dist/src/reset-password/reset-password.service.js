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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
let ResetPasswordService = class ResetPasswordService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    createTransport() {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return transporter;
    }
    async generateResetToken(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error('Usuario no encontrado');
        const expiresInSec = 60 * 60;
        const token = this.jwtService.sign({ email }, { expiresIn: expiresInSec });
        const expiresAt = new Date(Date.now() + expiresInSec * 1000);
        await this.prisma.passwordReset.create({
            data: { email, token, expiresAt },
        });
        const transporter = this.createTransport();
        try {
            await transporter.verify();
            const resetUrl = `${process.env.APP_URL}/reset-password/${encodeURIComponent(token)}`;
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
        }
        catch (err) {
            await this.prisma.passwordReset.delete({ where: { token } });
            throw err;
        }
        return token;
    }
    async resetPassword(token, newPassword) {
        const resetRequest = await this.prisma.passwordReset.findUnique({
            where: { token },
        });
        if (!resetRequest || new Date() > resetRequest.expiresAt) {
            throw new Error('Token inválido o expirado');
        }
        const user = await this.prisma.user.findUnique({
            where: { email: resetRequest.email },
        });
        if (!user)
            throw new Error('Usuario no encontrado');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email: user.email },
            data: { password: hashedPassword },
        });
        await this.prisma.passwordReset.delete({ where: { token } });
    }
};
exports.ResetPasswordService = ResetPasswordService;
exports.ResetPasswordService = ResetPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], ResetPasswordService);
//# sourceMappingURL=reset-password.service.js.map