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
exports.UpdateEmpresaDto = exports.TargetEnum = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TargetEnum;
(function (TargetEnum) {
    TargetEnum["MEDICO"] = "MEDICO";
    TargetEnum["ESTETICISTA"] = "ESTETICISTA";
})(TargetEnum || (exports.TargetEnum = TargetEnum = {}));
class UpdateEmpresaDto {
}
exports.UpdateEmpresaDto = UpdateEmpresaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmpresaDto.prototype, "dni", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmpresaDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TargetEnum, description: 'Target must be either MEDICO or ESTETICISTA' }),
    (0, class_validator_1.IsEnum)(TargetEnum, { message: 'Target must be either MEDICO or ESTETICISTA' }),
    __metadata("design:type", String)
], UpdateEmpresaDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmpresaDto.prototype, "categoryId", void 0);
//# sourceMappingURL=update-empresa.dto.js.map