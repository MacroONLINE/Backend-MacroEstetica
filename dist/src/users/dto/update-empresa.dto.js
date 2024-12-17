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
exports.CreateEmpresaDto = exports.GiroEnum = exports.SubscriptionType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SubscriptionType;
(function (SubscriptionType) {
    SubscriptionType["ORO"] = "ORO";
    SubscriptionType["PLATA"] = "PLATA";
    SubscriptionType["BRONCE"] = "BRONCE";
})(SubscriptionType || (exports.SubscriptionType = SubscriptionType = {}));
var GiroEnum;
(function (GiroEnum) {
    GiroEnum["SERVICIOS"] = "SERVICIOS";
    GiroEnum["PRODUCTOS"] = "PRODUCTOS";
    GiroEnum["CONSULTORIA"] = "CONSULTORIA";
    GiroEnum["OTRO"] = "OTRO";
})(GiroEnum || (exports.GiroEnum = GiroEnum = {}));
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
    (0, swagger_1.ApiProperty)({ enum: GiroEnum, description: 'Giro de la empresa' }),
    (0, class_validator_1.IsEnum)(GiroEnum, { message: 'Giro must be SERVICIOS, PRODUCTOS, CONSULTORIA, or OTRO' }),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "giro", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SubscriptionType,
        description: 'Tipo de suscripción de la empresa',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SubscriptionType, {
        message: 'Subscription must be ORO, PLATA, or BRONCE',
    }),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario asociado a la empresa' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmpresaDto.prototype, "userId", void 0);
//# sourceMappingURL=update-empresa.dto.js.map