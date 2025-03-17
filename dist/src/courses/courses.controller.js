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
const swagger_1 = require("@nestjs/swagger");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async getAllCourses() {
        return this.coursesService.getAllCourses();
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
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses with modules and classes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of courses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get course by ID with modules, classes, resources' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', example: 'abc123', description: 'Course ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Course not found' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses a user is enrolled in, with progress info' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 'user-001', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of user courses with progress' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserCourses", null);
__decorate([
    (0, common_1.Get)('user/:userId/course/:courseId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress for a specific course' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 'user-001' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', example: 'abc123' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Course progress returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not enrolled or course not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserCourseProgress", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get class by ID with resources' }),
    (0, swagger_1.ApiParam)({ name: 'classId', example: 'class-001', description: 'Class ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getClassById", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map