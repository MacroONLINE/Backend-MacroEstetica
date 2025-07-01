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
exports.ClassroomController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const classroom_service_1 = require("./classroom.service");
let ClassroomController = class ClassroomController {
    constructor(classroomService) {
        this.classroomService = classroomService;
    }
    async createClassroom(body) {
        return this.classroomService.createClassroom(body);
    }
    async updateClassroom(id, body) {
        return this.classroomService.updateClassroom(id, body);
    }
    async deleteClassroom(id) {
        return this.classroomService.deleteClassroom(id);
    }
    async getUpcomingClassrooms() {
        return this.classroomService.getUpcomingClassrooms();
    }
    async getLiveClassrooms() {
        const classrooms = await this.classroomService.getLiveClassrooms();
        if (!classrooms || classrooms.length === 0) {
            throw new common_1.NotFoundException('There are no live classrooms at this moment');
        }
        return classrooms;
    }
    async getClassroomById(id) {
        const classroom = await this.classroomService.getClassroomById(id);
        if (!classroom)
            throw new common_1.NotFoundException('Classroom not found');
        return classroom;
    }
    async addOrator(id, body) {
        return this.classroomService.addOrator(id, body.instructorId);
    }
    async removeOrator(id, body) {
        return this.classroomService.removeOrator(id, body.instructorId);
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new classroom' }),
    (0, swagger_1.ApiBody)({
        description: 'JSON payload containing basic classroom data',
        schema: {
            example: {
                title: 'Advanced Aesthetics Marathon',
                description: 'Full day of hands-on aesthetic procedures.',
                price: 49.99,
                startDateTime: '2025-03-20T15:00:00Z',
                endDateTime: '2025-03-20T21:00:00Z',
                imageUrl: 'https://cdn.example.com/img/banner.jpg',
                channelName: 'classroom-aesthetics-001',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Classroom successfully created',
        schema: {
            example: {
                id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
                title: 'Advanced Aesthetics Marathon',
                description: 'Full day of hands-on aesthetic procedures.',
                price: 49.99,
                startDateTime: '2025-03-20T15:00:00.000Z',
                endDateTime: '2025-03-20T21:00:00.000Z',
                imageUrl: 'https://cdn.example.com/img/banner.jpg',
                channelName: 'classroom-aesthetics-001',
                createdAt: '2025-01-18T09:55:34.000Z',
                updatedAt: '2025-01-18T09:55:34.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid data supplied for classroom creation',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "createClassroom", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing classroom' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Classroom ID to update',
        example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Fields to update (partial payload allowed)',
        schema: {
            example: {
                title: 'Advanced Aesthetics Marathon – Updated',
                description: 'Updated short description',
                price: 59.99,
                startDateTime: '2025-03-20T16:00:00Z',
                endDateTime: '2025-03-20T22:00:00Z',
                imageUrl: 'https://cdn.example.com/img/banner_v2.jpg',
                channelName: 'classroom-aesthetics-001',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom successfully updated',
        schema: {
            example: {
                id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
                title: 'Advanced Aesthetics Marathon – Updated',
                description: 'Updated short description',
                price: 59.99,
                startDateTime: '2025-03-20T16:00:00.000Z',
                endDateTime: '2025-03-20T22:00:00.000Z',
                imageUrl: 'https://cdn.example.com/img/banner_v2.jpg',
                channelName: 'classroom-aesthetics-001',
                orators: [],
                attendees: [],
                enrollments: [],
                isLive: false,
                createdAt: '2025-01-18T09:55:34.000Z',
                updatedAt: '2025-01-18T10:30:41.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "updateClassroom", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a classroom by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Classroom ID to delete',
        example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom successfully deleted',
        schema: { example: { message: 'Classroom deleted successfully' } },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "deleteClassroom", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'List all classrooms that have not started yet' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Array of upcoming classrooms',
        schema: {
            example: [
                {
                    id: 'cls_upcoming_001',
                    title: 'Laser Physics 101',
                    startDateTime: '2025-04-01T14:00:00.000Z',
                    endDateTime: '2025-04-01T18:00:00.000Z',
                    isLive: false,
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getUpcomingClassrooms", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'List all classrooms currently live' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Array of live classrooms',
        schema: {
            example: [
                {
                    id: 'cls_live_001',
                    title: 'Dermatology Morning Session',
                    startDateTime: '2025-01-18T08:00:00.000Z',
                    endDateTime: '2025-01-18T12:00:00.000Z',
                    isLive: true,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No live classrooms at this moment',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getLiveClassrooms", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a classroom by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Classroom ID to fetch',
        example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom detail',
        schema: {
            example: {
                id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
                title: 'Advanced Aesthetics Marathon',
                description: 'Full day of hands-on aesthetic procedures.',
                price: 49.99,
                startDateTime: '2025-03-20T15:00:00.000Z',
                endDateTime: '2025-03-20T21:00:00.000Z',
                isLive: false,
                orators: [],
                attendees: [],
                enrollments: [],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getClassroomById", null);
__decorate([
    (0, common_1.Patch)(':id/add-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Add an instructor (orator) to a classroom' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Classroom ID to attach the instructor to',
        example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            description: 'Payload containing the instructor ID',
            example: { instructorId: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Instructor successfully linked to classroom',
        schema: {
            example: {
                id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
                orators: [{ id: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH', name: 'Dr. Jane Doe' }],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "addOrator", null);
__decorate([
    (0, common_1.Patch)(':id/remove-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an instructor (orator) from a classroom' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Classroom ID to detach the instructor from',
        example: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            description: 'Payload containing the instructor ID',
            example: { instructorId: 'instr_01HTX40T5AJ2Z6QXN3JJ68X3DH' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Instructor successfully removed from classroom',
        schema: {
            example: {
                id: 'cls_01HTX3C21TEY5Q9Y25E4ARQ1KZ',
                orators: [],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom or instructor not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "removeOrator", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('classroom'),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map