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
exports.CoursesFetchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CoursesFetchDto {
}
exports.CoursesFetchDto = CoursesFetchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identificador único del curso' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título del curso' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del instructor' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "instructor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio del curso' }),
    __metadata("design:type", Number)
], CoursesFetchDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de comentarios' }),
    __metadata("design:type", Number)
], CoursesFetchDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha del curso', type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], CoursesFetchDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Calificación promedio' }),
    __metadata("design:type", Number)
], CoursesFetchDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de la imagen del curso' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la categoría' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ícono de la categoría' }),
    __metadata("design:type", String)
], CoursesFetchDto.prototype, "categoryIcon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si el curso es destacado' }),
    __metadata("design:type", Boolean)
], CoursesFetchDto.prototype, "featured", void 0);
//# sourceMappingURL=courses-fetch.dto.js.map