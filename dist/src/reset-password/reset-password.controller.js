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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordController = void 0;
const common_1 = require("@nestjs/common");
const reset_password_service_1 = require("./reset-password.service");
let ResetPasswordController = class ResetPasswordController {
    constructor(resetPasswordService) {
        this.resetPasswordService = resetPasswordService;
    }
    async requestReset(email) {
        await this.resetPasswordService.generateResetToken(email);
        return { message: 'Correo de recuperación enviado' };
    }
    async reset(token, newPassword) {
        await this.resetPasswordService.resetPassword(token, newPassword);
        return { message: 'Contraseña actualizada' };
    }
};
exports.ResetPasswordController = ResetPasswordController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResetPasswordController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Post)('reset/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ResetPasswordController.prototype, "reset", null);
exports.ResetPasswordController = ResetPasswordController = __decorate([
    (0, common_1.Controller)('reset-password'),
    __metadata("design:paramtypes", [reset_password_service_1.ResetPasswordService])
], ResetPasswordController);
//# sourceMappingURL=reset-password.controller.js.map