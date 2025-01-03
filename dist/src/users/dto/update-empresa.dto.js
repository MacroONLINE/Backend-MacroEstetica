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
exports.CreateEmpresaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateEmpresaDto {
}
exports.CreateEmpresaDto = CreateEmpresaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DNI de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "dni", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la empresa' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Giro, description: 'Giro de la empresa' }),
    (0, class_validator_1.IsEnum)(client_1.Giro, { message: 'Giro must be a valid enum value' }),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "giro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.SubscriptionType,
        description: 'Tipo de suscripción de la empresa',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionType, {
        message: 'Subscription must be a valid enum value',
    }),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario asociado a la empresa' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Imagen del banner de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "bannerImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Logo de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Imagen de perfil de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del CEO de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "ceo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cargo del CEO de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "ceoRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ubicación de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de seguidores de la empresa', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Number)
], CreateEmpresaDto.prototype, "followers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL del sitio web de la empresa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "webUrl", void 0);
//# sourceMappingURL=update-empresa.dto.js.map