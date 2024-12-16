"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const reset_password_service_1 = require("./reset-password.service");
const reset_password_controller_1 = require("./reset-password.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ResetPasswordModule = class ResetPasswordModule {
};
exports.ResetPasswordModule = ResetPasswordModule;
exports.ResetPasswordModule = ResetPasswordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' },
            }),
        ],
        controllers: [reset_password_controller_1.ResetPasswordController],
        providers: [reset_password_service_1.ResetPasswordService],
    })
], ResetPasswordModule);
//# sourceMappingURL=reset-password.module.js.map