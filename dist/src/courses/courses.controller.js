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
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const create_module_dto_1 = require("./dto/create-module.dto");
const create_class_dto_1 = require("./dto/create-class.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const active_courses_dto_1 = require("./dto/course-card.dto/active-courses.dto");
const client_1 = require("@prisma/client");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async createCourse(dto) {
        return this.coursesService.createCourse(dto);
    }
    async getActiveCourses(userId) {
        return this.coursesService.getActiveCoursesCardInfo(userId);
    }
    async createModule(dto) {
        return this.coursesService.createModule(dto);
    }
    async createClass(dto) {
        return this.coursesService.createClass(dto);
    }
    async createComment(dto) {
        return this.coursesService.createClassComment(dto);
    }
    async createCategory(dto) {
        return this.coursesService.createCategory(dto);
    }
    async getAllCourses(userId) {
        return this.coursesService.getAllCourses(userId);
    }
    async getFeaturedCourses(userId) {
        return this.coursesService.getFeaturedCourses(userId);
    }
    async getCoursesByCategory(categoryId, userId) {
        return this.coursesService.getCoursesByCategory(categoryId, userId);
    }
    async getCoursesByInstructor(instructorId, userId) {
        return this.coursesService.getCoursesByInstructor(instructorId, userId);
    }
    async getCoursesByTarget(target, userId) {
        return this.coursesService.getCoursesByTarget(target, userId);
    }
    async reactToCourse(courseId, userId, type) {
        return this.coursesService.toggleCourseReaction(userId, courseId, type || client_1.ReactionType.LIKE);
    }
    async getUserCourses(userId) {
        return this.coursesService.getUserCourses(userId);
    }
    async getUserCourseProgress(userId, courseId) {
        return this.coursesService.getUserCourseProgress(userId, courseId);
    }
    async isUserEnrolled(courseId, userId) {
        return this.coursesService.isUserEnrolled(courseId, userId);
    }
    async getUserModuleProgress(moduleId, userId) {
        return this.coursesService.getUserModuleProgress(moduleId, userId);
    }
    async markClassAsCompleted(classId, userId) {
        return this.coursesService.markClassAsCompleted(userId, classId);
    }
    async getCourseWishlist(userId) {
        return this.coursesService.getLikedCourses(userId);
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
    (0, common_1.Get)('user/:userId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active courses card info for a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: active_courses_dto_1.ActiveCoursesDto }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getActiveCourses", null);
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
    (0, swagger_1.ApiOperation)({ summary: 'Get all courses (optionally marks liked courses)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'User ID → adds liked:boolean to each course' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getAllCourses", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured courses (optionally marks liked courses)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getFeaturedCourses", null);
__decorate([
    (0, common_1.Get)('by-category/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by category (optionally marks liked courses)' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'Category ID' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByCategory", null);
__decorate([
    (0, common_1.Get)('by-instructor/:instructorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by instructor (optionally marks liked courses)' }),
    (0, swagger_1.ApiParam)({ name: 'instructorId', description: 'Instructor ID' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Param)('instructorId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByInstructor", null);
__decorate([
    (0, common_1.Get)('by-target/:target'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses by target (optionally marks liked courses)' }),
    (0, swagger_1.ApiParam)({ name: 'target', description: 'MEDICO | COSMETOLOGO' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Param)('target')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCoursesByTarget", null);
__decorate([
    (0, common_1.Post)(':courseId/user/:userId/react'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like/dislike for a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['type'],
            properties: {
                type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "reactToCourse", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get courses enrolled by a user with progress' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
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
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserCourseProgress", null);
__decorate([
    (0, common_1.Get)(':courseId/user/:userId/enrolled'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a user is enrolled in a course' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "isUserEnrolled", null);
__decorate([
    (0, common_1.Get)('module/:moduleId/user/:userId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get classes completed by a user in a module' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'Module ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getUserModuleProgress", null);
__decorate([
    (0, common_1.Post)('class/:classId/user/:userId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a class as completed for a user' }),
    (0, swagger_1.ApiParam)({ name: 'classId', description: 'Class ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "markClassAsCompleted", null);
__decorate([
    (0, common_1.Get)('user/:userId/wishlist'),
    (0, swagger_1.ApiOperation)({ summary: 'Cursos a los que el usuario dio like (wishlist)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseWishlist", null);
__decorate([
    (0, common_1.Get)(':courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a course by ID' }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'Course ID' }),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseById", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map