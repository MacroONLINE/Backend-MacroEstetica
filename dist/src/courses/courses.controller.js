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
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
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
    async getUserCourses(userId) {
        return this.coursesService.getUserCourses(userId);
    }
    async getUserCourseProgress(userId, courseId) {
        return this.coursesService.getUserCourseProgress(userId, courseId);
    }
    async getClassById(classId) {
        return this.coursesService.getClassById(classId);
    }
    async isUserEnrolled(courseId, userId) {
        return this.coursesService.isUserEnrolled(courseId, userId);
    }
    async getModulesByCourse(courseId) {
        return this.coursesService.getModulesByCourse(courseId);
    }
    async getModuleById(moduleId) {
        return this.coursesService.getModuleById(moduleId);
    }
    async getUserModuleProgress(moduleId, userId) {
        return this.coursesService.getUserModuleProgress(moduleId, userId);
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
    (0, swagger_1.ApiOperation)({ summary: 'Create a new course category' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses with full details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all courses.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured courses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of featured courses.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getFeaturedCourses", null);
__decorate([
    (0, common_1.Get)('by-category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by category ID' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'ID of the category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses by category.' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByCategory", null);
__decorate([
    (0, common_1.Get)('by-instructor/:instructorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by instructor ID' }),
    (0, swagger_1.ApiParam)({ name: 'instructorId', description: 'ID of the instructor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses by instructor.' }),
    __param(0, (0, common_1.Param)('instructorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByInstructor", null);
__decorate([
    (0, common_1.Get)('by-target/:target'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by target audience' }),
    (0, swagger_1.ApiParam)({ name: 'target', description: 'Target audience (e.g., MEDICO, COSMETOLOGO)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses by target audience.' }),
    __param(0, (0, common_1.Param)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByTarget", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a course by ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'ID of the course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found.' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses enrolled by a user with progress' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User enrolled courses with progress.' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserCourses", null);
__decorate([
    (0, common_1.Get)('user/:userId/course/:courseId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress in a specific course' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User progress returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User or course not found.' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserCourseProgress", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get class details by ID' }),
    (0, swagger_1.ApiParam)({ name: 'classId', description: 'Class ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found.' }),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getClassById", null);
__decorate([
    (0, common_1.Get)(':courseId/user/:userId/enrolled'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a user is enrolled in a specific course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollment status returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course or user not found.' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "isUserEnrolled", null);
__decorate([
    (0, common_1.Get)('modules/course/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modules by course ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Modules of the specified course returned.' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getModulesByCourse", null);
__decorate([
    (0, common_1.Get)('module/:moduleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific module' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'Module ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module details returned.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Module not found.' }),
    __param(0, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getModuleById", null);
__decorate([
    (0, common_1.Get)('module/:moduleId/user/:userId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get classes approved by a user in a specific module' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'Module ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User class progress in the module returned.' }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserModuleProgress", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map