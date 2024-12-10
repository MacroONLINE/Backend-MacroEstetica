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
exports.CommentResponseDto = exports.ClassResponseDto = exports.ModuleResponseDto = exports.CourseResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CourseResponseDto {
}
exports.CourseResponseDto = CourseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longer about description of the course', required: false }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "aboutDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total hours of the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "totalHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price of the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Discount percentage of the course', required: false }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Level of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of participants in the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "participantsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating of the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the course is featured' }),
    __metadata("design:type", Boolean)
], CourseResponseDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Banner URL of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Square image URL of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "courseImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'What you will learn in the course (JSON)', required: false }),
    __metadata("design:type", Object)
], CourseResponseDto.prototype, "whatYouWillLearn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Requirements for the course (JSON)', required: false }),
    __metadata("design:type", Object)
], CourseResponseDto.prototype, "requirements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Instructor ID of the course' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "instructorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the category' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "categoryName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Color of the category' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "categoryColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Icon URL of the category' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "categoryIcon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the instructor' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "instructorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Experience years of the instructor' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "instructorExperience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Certifications URL of the instructor' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "instructorCertificationsUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Status of the instructor' }),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "instructorStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of resources in the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "totalResources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of resources for the course' }),
    __metadata("design:type", Array)
], CourseResponseDto.prototype, "resources", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of modules in the course' }),
    __metadata("design:type", Number)
], CourseResponseDto.prototype, "totalModules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of modules in the course', type: () => [ModuleResponseDto] }),
    __metadata("design:type", Array)
], CourseResponseDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of comments associated with the course', type: () => [CommentResponseDto] }),
    __metadata("design:type", Array)
], CourseResponseDto.prototype, "comments", void 0);
class ModuleResponseDto {
}
exports.ModuleResponseDto = ModuleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the module' }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the module' }),
    __metadata("design:type", String)
], ModuleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of classes in the module', type: () => [ClassResponseDto] }),
    __metadata("design:type", Array)
], ModuleResponseDto.prototype, "classes", void 0);
class ClassResponseDto {
}
exports.ClassResponseDto = ClassResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the class' }),
    __metadata("design:type", String)
], ClassResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the class' }),
    __metadata("design:type", String)
], ClassResponseDto.prototype, "description", void 0);
class CommentResponseDto {
}
exports.CommentResponseDto = CommentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the comment' }),
    __metadata("design:type", String)
], CommentResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who made the comment' }),
    __metadata("design:type", String)
], CommentResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Content of the comment' }),
    __metadata("design:type", String)
], CommentResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating of the comment' }),
    __metadata("design:type", Number)
], CommentResponseDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the comment was created' }),
    __metadata("design:type", Date)
], CommentResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the comment was last updated' }),
    __metadata("design:type", Date)
], CommentResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=course-response.dto.js.map