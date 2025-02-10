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
    async getClassroomById(id) {
        const classroom = await this.classroomService.getClassroomById(id);
        if (!classroom)
            throw new common_1.NotFoundException('Classroom no encontrado');
        return classroom;
    }
    async updateClassroom(id, body) {
        return this.classroomService.updateClassroom(id, body);
    }
    async deleteClassroom(id) {
        return this.classroomService.deleteClassroom(id);
    }
    async getUpcomingWorkshopsForClassroom(classroomId) {
        const workshops = await this.classroomService.getUpcomingWorkshopsForClassroom(classroomId);
        return workshops;
    }
    async getUpcomingClassrooms() {
        return this.classroomService.getUpcomingClassrooms();
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crea un nuevo Classroom' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Classroom creado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos inválidos para la creación del classroom',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "createClassroom", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene un Classroom por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del Classroom a buscar' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna el Classroom si existe',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classroom no encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getClassroomById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualiza un Classroom existente' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del Classroom a actualizar' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom actualizado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classroom no encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "updateClassroom", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Elimina un Classroom por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del Classroom a eliminar' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Classroom eliminado correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classroom no encontrado',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "deleteClassroom", null);
__decorate([
    (0, common_1.Get)(':id/upcoming-workshops'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los Workshops próximos de un Classroom' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del Classroom' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de Workshops próximos',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Classroom no encontrado o sin workshops próximos',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getUpcomingWorkshopsForClassroom", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene todos los Classrooms con Workshops próximos' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de Classrooms con al menos un Workshop futuro',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "getUpcomingClassrooms", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('classroom'),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map