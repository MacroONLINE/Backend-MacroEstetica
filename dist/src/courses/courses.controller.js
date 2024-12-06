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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const create_module_dto_1 = require("./dto/create-module.dto");
const create_class_dto_1 = require("./dto/create-class.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const course_response_dto_1 = require("./response-dto/course-response.dto");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(createCourseDto) {
        return this.coursesService.createCourse(createCourseDto);
    }
    async createModule(createModuleDto) {
        return this.coursesService.createModule(createModuleDto);
    }
    async createClass(createClassDto) {
        return this.coursesService.createClass(createClassDto);
    }
    async createComment(createCommentDto) {
        return this.coursesService.createComment(createCommentDto);
    }
    async createCategory(createCategoryDto) {
        return this.coursesService.createCategory(createCategoryDto);
    }
    async getAllCourses() {
        return this.coursesService.getAllCourses();
    }
    async getFeaturedCourses() {
        return this.coursesService.getFeaturedCourses();
    }
    async getCoursesByCategory(categoryId) {
        return this.coursesService.getCoursesByCategory(categoryId);
    }
    async getCoursesByInstructor(instructorId) {
        return this.coursesService.getCoursesByInstructor(instructorId);
    }
    async getCoursesByTarget(target) {
        return this.coursesService.getCoursesByTarget(target);
    }
    async getCourseById(courseId) {
        return this.coursesService.getCourseById(courseId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Course created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCourse", null);
__decorate([
    (0, common_1.Post)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new module for a course' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Module created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createModule", null);
__decorate([
    (0, common_1.Post)('classes'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new class for a module' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Class created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createClass", null);
__decorate([
    (0, common_1.Post)('comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new comment for a class' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createComment", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses retrieved.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured courses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of featured courses retrieved.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getFeaturedCourses", null);
__decorate([
    (0, common_1.Get)('by-category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by category' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'The ID of the category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses retrieved.' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByCategory", null);
__decorate([
    (0, common_1.Get)('by-instructor/:instructorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by instructor' }),
    (0, swagger_1.ApiParam)({ name: 'instructorId', description: 'The ID of the instructor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses retrieved.' }),
    __param(0, (0, common_1.Param)('instructorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByInstructor", null);
__decorate([
    (0, common_1.Get)('by-target/:target'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by target audience' }),
    (0, swagger_1.ApiParam)({ name: 'target', description: 'Target audience (e.g., MEDICO, ESTETICISTA)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses retrieved.' }),
    __param(0, (0, common_1.Param)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByTarget", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a course by ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'The ID of the course' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: course_response_dto_1.CourseResponseDto, description: 'Course retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found.' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('courses'),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map