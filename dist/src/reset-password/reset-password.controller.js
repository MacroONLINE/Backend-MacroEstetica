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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ResetPasswordController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordController = void 0;
const common_1 = require("@nestjs/common");
const reset_password_service_1 = require("./reset-password.service");
function isEmail(s) {
    if (!s)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function isRecord(x) {
    return typeof x === 'object' && x !== null;
}
const isProd = process.env.NODE_ENV === 'production';
let ResetPasswordController = ResetPasswordController_1 = class ResetPasswordController {
    constructor(resetPasswordService) {
        this.resetPasswordService = resetPasswordService;
        this.logger = new common_1.Logger(ResetPasswordController_1.name);
    }
    async requestReset(email, req) {
        const rid = `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
        this.logger.log(`[${rid}] POST ${req?.url ?? '/reset-password/request'}`);
        if (!isEmail(email)) {
            this.logger.warn(`[${rid}] email inválido: "${email}"`);
            return {
                ok: true,
                message: 'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
            };
        }
        this.logger.log(`[${rid}] solicitando reset para: ${email}`);
        try {
            const result = await this.resetPasswordService.generateResetToken(email);
            if (isRecord(result) && isRecord(result.smtpInfo)) {
                this.logger.log(`[${rid}] email de reset enviado. smtp.response="${result.smtpInfo.response ?? 'n/a'}" id="${result.smtpInfo.messageId ?? 'n/a'}"`);
            }
            else {
                this.logger.log(`[${rid}] solicitud procesada (posible usuario inexistente o service devolvió token).`);
            }
            const payload = {
                ok: true,
                message: 'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
            };
            if (isRecord(result)) {
                payload.data = result;
            }
            else if (!isProd && typeof result === 'string') {
                payload.token = result;
            }
            return payload;
        }
        catch (e) {
            this.logger.error(`[${rid}] error en requestReset: ${e?.message ?? e}`, e?.stack);
            return {
                ok: true,
                message: 'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
                ...(!isProd
                    ? {
                        error: {
                            name: e?.name ?? 'Error',
                            message: e?.message ?? String(e),
                            stack: e?.stack,
                        },
                    }
                    : {}),
            };
        }
    }
    async reset(token, newPassword, req) {
        const rid = `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;
        this.logger.log(`[${rid}] POST ${req?.url ?? '/reset-password/reset/:token'}`);
        if (!newPassword || newPassword.length < 8) {
            this.logger.warn(`[${rid}] newPassword inválido (mínimo 8 chars). length=${newPassword?.length ?? 0}`);
            throw new common_1.BadRequestException('La nueva contraseña debe tener al menos 8 caracteres.');
        }
        try {
            await this.resetPasswordService.resetPassword(token, newPassword);
            this.logger.log(`[${rid}] contraseña actualizada correctamente.`);
            return { ok: true, message: 'Contraseña actualizada' };
        }
        catch (e) {
            this.logger.error(`[${rid}] error en reset: ${e?.message ?? e}`, e?.stack);
            return {
                ok: false,
                message: 'No se pudo actualizar la contraseña',
                ...(!isProd
                    ? {
                        error: {
                            name: e?.name ?? 'Error',
                            message: e?.message ?? String(e),
                            stack: e?.stack,
                        },
                    }
                    : {}),
            };
        }
    }
};
exports.ResetPasswordController = ResetPasswordController;
__decorate([
    (0, common_1.Post)('request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResetPasswordController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Post)('reset/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ResetPasswordController.prototype, "reset", null);
exports.ResetPasswordController = ResetPasswordController = ResetPasswordController_1 = __decorate([
    (0, common_1.Controller)('reset-password'),
    __metadata("design:paramtypes", [reset_password_service_1.ResetPasswordService])
], ResetPasswordController);
//# sourceMappingURL=reset-password.controller.js.map