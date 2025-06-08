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
exports.InstructorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const instructor_service_1 = require("./instructor.service");
const create_instructor_dto_1 = require("./dto/create-instructor.dto");
const update_instructor_dto_1 = require("./dto/update-instructor.dto");
let InstructorController = class InstructorController {
    constructor(instructorService) {
        this.instructorService = instructorService;
    }
    async createInstructor(createInstructorDto) {
        return this.instructorService.createInstructor(createInstructorDto);
    }
    async getAllInstructors() {
        return this.instructorService.getAllInstructors();
    }
    async getInstructorById(id) {
        return this.instructorService.getInstructorById(id);
    }
    async getInstructorsByCategory(categoryId) {
        return this.instructorService.getInstructorsByCategory(categoryId);
    }
    async getInstructorsByEmpresa(empresaId) {
        return this.instructorService.getInstructorsByEmpresa(empresaId);
    }
    async updateInstructor(id, updateDto) {
        return this.instructorService.updateInstructor(id, updateDto);
    }
    async deleteInstructor(id) {
        return this.instructorService.deleteInstructor(id);
    }
    async convertUserToInstructor(userId, description) {
        return this.instructorService.convertUserToInstructor(userId, description);
    }
};
exports.InstructorController = InstructorController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear un instructor' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_instructor_dto_1.CreateInstructorDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "createInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los instructores' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getAllInstructors", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un instructor por ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getInstructorById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener instructores por categoría' }),
    (0, common_1.Get)('by-category/search'),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getInstructorsByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener instructores por empresa' }),
    (0, common_1.Get)('by-empresa/search'),
    __param(0, (0, common_1.Query)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getInstructorsByEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un instructor' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "updateInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un instructor' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "deleteInstructor", null);
__decorate([
    (0, common_1.Post)('convert/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Convertir un usuario en instructor (solo descripción)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['description'],
            properties: {
                description: { type: 'string', example: 'Especialista en láser facial' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "convertUserToInstructor", null);
exports.InstructorController = InstructorController = __decorate([
    (0, swagger_1.ApiTags)('instructors'),
    (0, common_1.Controller)('instructors'),
    __metadata("design:paramtypes", [instructor_service_1.InstructorService])
], InstructorController);
//# sourceMappingURL=instructor.controller.js.map