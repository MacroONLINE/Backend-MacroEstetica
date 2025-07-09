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
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const classroom_service_1 = require("./classroom.service");
const create_classroom_dto_1 = require("./dto/create-classroom.dto");
const update_classroom_dto_1 = require("./dto/update-classroom.dto");
const client_1 = require("@prisma/client");
class OratorDto {
}
let ClassroomController = class ClassroomController {
    constructor(service) {
        this.service = service;
    }
    create(empresaId, dto, image) {
        return this.service.createClassroom(empresaId, dto, image);
    }
    update(empresaId, id, dto, image) {
        return this.service.updateClassroom(id, empresaId, dto, image);
    }
    remove(id) {
        return this.service.deleteClassroom(id);
    }
    upcoming() {
        return this.service.getUpcomingClassrooms();
    }
    live() {
        return this.service.getLiveClassrooms();
    }
    getOrators(empresaId) {
        return this.service.getAllOrators(empresaId);
    }
    findOne(id) {
        return this.service.getClassroomById(id);
    }
    findAllByEmpresa(empresaId) {
        return this.service.getAllByEmpresa(empresaId);
    }
    addOrator(id, dto) {
        return this.service.addOrator(id, dto.instructorId);
    }
    removeOrator(id, dto) {
        return this.service.removeOrator(id, dto.instructorId);
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear classroom' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiBody)({
        description: 'Formulario multipart/form-data para crear un classroom',
        schema: {
            type: 'object',
            required: ['title', 'description', 'startDateTime', 'endDateTime'],
            properties: {
                title: { type: 'string', example: 'Masterclass Botox' },
                description: { type: 'string', example: 'Técnicas avanzadas de aplicación de toxina botulínica' },
                price: { type: 'number', example: 150 },
                startDateTime: { type: 'string', format: 'date-time', example: '2025-11-20T14:00:00Z' },
                endDateTime: { type: 'string', format: 'date-time', example: '2025-11-20T16:00:00Z' },
                channelName: { type: 'string', example: 'classroom-btx-001' },
                categories: {
                    type: 'array',
                    items: { type: 'string', enum: Object.values(client_1.$Enums.Profession) },
                    example: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
                },
                oratorIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['instr_001', 'instr_002'],
                },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Classroom creado',
        schema: {
            example: {
                id: 'cls_001',
                title: 'Masterclass Botox',
                description: 'Técnicas avanzadas de aplicación de toxina botulínica',
                price: 150,
                startDateTime: '2025-11-20T14:00:00.000Z',
                endDateTime: '2025-11-20T16:00:00.000Z',
                channelName: 'classroom-btx-001',
                categories: ['DERMATOLOGIA', 'MEDICINA_ESTETICA'],
                empresaId: 'comp_001',
                orators: [{ id: 'instr_001' }, { id: 'instr_002' }],
                attendees: [],
                enrollments: [],
                imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
                isLive: false,
                createdAt: '2025-10-01T10:00:00.000Z',
                updatedAt: '2025-10-01T10:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_classroom_dto_1.CreateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar classroom' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'cls_001' }),
    (0, swagger_1.ApiBody)({
        description: 'Multipart/form-data para actualizar classroom (solo campos a modificar)',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Masterclass Botox Avanzado' },
                description: { type: 'string', example: 'Actualización de técnicas' },
                price: { type: 'number', example: 200 },
                startDateTime: { type: 'string', format: 'date-time', example: '2025-11-20T15:00:00Z' },
                endDateTime: { type: 'string', format: 'date-time', example: '2025-11-20T18:00:00Z' },
                channelName: { type: 'string', example: 'classroom-btx-adv' },
                categories: {
                    type: 'array',
                    items: { type: 'string', enum: Object.values(client_1.$Enums.Profession) },
                    example: ['DERMATOLOGIA'],
                },
                oratorIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['instr_001'],
                },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Classroom actualizado' }),
    (0, swagger_1.ApiNotFoundResponse)(),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_classroom_dto_1.UpdateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar classroom' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'cls_001' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Classroom eliminado' }),
    (0, swagger_1.ApiNotFoundResponse)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Próximos classrooms (todas las empresas)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de próximos classrooms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "upcoming", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Classrooms en vivo (todas las empresas)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de classrooms en vivo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "live", null);
__decorate([
    (0, common_1.Get)('orators'),
    (0, swagger_1.ApiOperation)({ summary: 'Instructores de la empresa' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado de instructores' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "getOrators", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de classroom' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'cls_001' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Detalle del classroom' }),
    (0, swagger_1.ApiNotFoundResponse)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listado de classrooms de la empresa' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado completo de classrooms' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findAllByEmpresa", null);
__decorate([
    (0, common_1.Patch)(':id/add-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar instructor' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'cls_001' }),
    (0, swagger_1.ApiBody)({ type: OratorDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Instructor agregado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OratorDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "addOrator", null);
__decorate([
    (0, common_1.Patch)(':id/remove-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Quitar instructor' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'cls_001' }),
    (0, swagger_1.ApiBody)({ type: OratorDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Instructor quitado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OratorDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "removeOrator", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, swagger_1.ApiExtraModels)(create_classroom_dto_1.CreateClassroomDto, update_classroom_dto_1.UpdateClassroomDto, OratorDto),
    (0, common_1.Controller)('empresas/:empresaId/classrooms'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map