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
const class_validator_1 = require("class-validator");
const classroom_service_1 = require("./classroom.service");
class CreateClassroomDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateClassroomDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "startDateTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "endDateTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "channelName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CreateClassroomDto.prototype, "categoriesIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CreateClassroomDto.prototype, "oratorIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CreateClassroomDto.prototype, "attendeeIds", void 0);
class UpdateClassroomDto extends CreateClassroomDto {
}
class OratorDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OratorDto.prototype, "instructorId", void 0);
let ClassroomController = class ClassroomController {
    constructor(classroomService) {
        this.classroomService = classroomService;
    }
    create(dto) {
        return this.classroomService.createClassroom(dto);
    }
    update(id, dto) {
        return this.classroomService.updateClassroom(id, dto);
    }
    remove(id) {
        return this.classroomService.deleteClassroom(id);
    }
    upcoming() {
        return this.classroomService.getUpcomingClassrooms();
    }
    async live() {
        const list = await this.classroomService.getLiveClassrooms();
        if (list.length === 0)
            throw new common_1.NotFoundException('No live classrooms at this moment');
        return list;
    }
    findOne(id) {
        return this.classroomService.getClassroomById(id);
    }
    addOrator(id, dto) {
        return this.classroomService.addOrator(id, dto.instructorId);
    }
    removeOrator(id, dto) {
        return this.classroomService.removeOrator(id, dto.instructorId);
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create classroom' }),
    (0, swagger_1.ApiBody)({ type: CreateClassroomDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Created classroom (IDs only)',
        schema: {
            example: {
                id: 'cls_001',
                title: 'Botulinum Toxin Masterclass',
                description: 'Hands-on training with live patients',
                price: 120,
                startDateTime: '2025-06-10T14:00:00.000Z',
                endDateTime: '2025-06-10T17:00:00.000Z',
                imageUrl: 'https://cdn.example.com/classrooms/btx.jpg',
                channelName: 'classroom-btx-001',
                categoriesIds: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
                oratorIds: ['instr_001'],
                attendeeIds: ['user_001'],
                isLive: false,
                createdAt: '2025-05-01T09:00:00.000Z',
                updatedAt: '2025-05-01T09:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payload' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClassroomDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update classroom' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    (0, swagger_1.ApiBody)({ type: UpdateClassroomDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Updated classroom (IDs only)',
        schema: {
            example: {
                id: 'cls_001',
                title: 'Masterclass – Updated',
                description: 'Extended Q&A',
                price: 150,
                startDateTime: '2025-06-10T15:00:00.000Z',
                endDateTime: '2025-06-10T18:00:00.000Z',
                categoriesIds: ['DERMATOLOGIA'],
                oratorIds: ['instr_001', 'instr_002'],
                attendeeIds: [],
                isLive: false,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateClassroomDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete classroom' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Classroom eliminado correctamente' } },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Upcoming classrooms' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: [
                {
                    id: 'cls_002',
                    title: 'Laser Safety Basics',
                    startDateTime: '2025-07-01T14:00:00.000Z',
                    endDateTime: '2025-07-01T17:00:00.000Z',
                    isLive: false,
                },
            ],
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "upcoming", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Live classrooms' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: [
                {
                    id: 'cls_003',
                    title: 'Dermatologic Suturing Techniques',
                    startDateTime: '2025-05-20T08:00:00.000Z',
                    endDateTime: '2025-05-20T11:00:00.000Z',
                    isLive: true,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No live classrooms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "live", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get classroom detail (IDs only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                id: 'cls_001',
                title: 'Botulinum Toxin Masterclass',
                description: 'Hands-on training with live patients',
                price: 120,
                startDateTime: '2025-06-10T14:00:00.000Z',
                endDateTime: '2025-06-10T17:00:00.000Z',
                categoriesIds: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
                oratorIds: ['instr_001'],
                attendeeIds: ['user_001'],
                isLive: false,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/add-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Add instructor to classroom' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    (0, swagger_1.ApiBody)({ type: OratorDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                id: 'cls_001',
                oratorIds: ['instr_001', 'instr_002'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom or instructor not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OratorDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "addOrator", null);
__decorate([
    (0, common_1.Patch)(':id/remove-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove instructor from classroom' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    (0, swagger_1.ApiBody)({ type: OratorDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                id: 'cls_001',
                oratorIds: ['instr_001'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom or instructor not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OratorDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "removeOrator", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('classroom'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map