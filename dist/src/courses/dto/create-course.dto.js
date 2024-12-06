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
exports.CreateCourseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const target_enum_1 = require("../enums/target.enum");
class CreateCourseDto {
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the course' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Banner URL of the course' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Square course image URL', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "courseImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Short description of the course' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed about description of the course', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "aboutDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total hours of the course', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category ID to associate the course' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Level of the course' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the course' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount percentage of the course', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience of the course', enum: target_enum_1.Target, required: false }),
    (0, class_validator_1.IsEnum)(target_enum_1.Target),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Instructor ID to associate with the course', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JSON for "What you will learn"', required: false }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "whatYouWillLearn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JSON for "Requirements"', required: false }),
    (0, class_validator_1.IsJSON)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the course is featured', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCourseDto.prototype, "isFeatured", void 0);
//# sourceMappingURL=create-course.dto.js.map