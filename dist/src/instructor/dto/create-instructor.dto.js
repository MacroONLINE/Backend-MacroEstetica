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
exports.CreateInstructorDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateInstructorDto {
}
exports.CreateInstructorDto = CreateInstructorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profesión del instructor (enum de Prisma)',
        enum: client_1.Profession,
    }),
    (0, class_validator_1.IsEnum)(client_1.Profession),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "profession", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de profesión del instructor (enum de Prisma)',
        enum: client_1.ProfessionType,
    }),
    (0, class_validator_1.IsEnum)(client_1.ProfessionType),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción o especialidad del instructor',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Años de experiencia',
        required: false,
        example: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInstructorDto.prototype, "experienceYears", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL con las certificaciones del instructor',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "certificationsUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del instructor (por ejemplo "active" o "inactive")',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario asociado al instructor',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la empresa para la cual trabaja el instructor',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "empresaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la categoría asociada al instructor',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInstructorDto.prototype, "categoryId", void 0);
//# sourceMappingURL=create-instructor.dto.js.map