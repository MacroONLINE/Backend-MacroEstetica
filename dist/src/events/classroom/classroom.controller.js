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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const classroom_service_1 = require("./classroom.service");
const client_1 = require("@prisma/client");
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
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateClassroomDto.prototype, "startDateTime", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateClassroomDto.prototype, "endDateTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "channelName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsEnum)(client_1.$Enums.Profession, { each: true }),
    __metadata("design:type", Array)
], CreateClassroomDto.prototype, "categories", void 0);
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
class UpdateClassroomDto extends (0, mapped_types_1.PartialType)(CreateClassroomDto) {
}
class OratorDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OratorDto.prototype, "instructorId", void 0);
let ClassroomController = class ClassroomController {
    constructor(service) {
        this.service = service;
    }
    create(empresaId, dto, image) {
        return this.service.createClassroom({ ...dto, empresaId, image });
    }
    update(empresaId, id, dto, image) {
        return this.service.updateClassroom(id, { ...dto, empresaId, image });
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
    findOne(id) {
        return this.service.getClassroomById(id);
    }
    addOrator(id, dto) {
        return this.service.addOrator(id, dto.instructorId);
    }
    removeOrator(id, dto) {
        return this.service.removeOrator(id, dto.instructorId);
    }
    findAllByEmpresa(empresaId) {
        return this.service.getAllByEmpresa(empresaId);
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
        schema: {
            type: 'object',
            required: ['title', 'description', 'price', 'startDateTime', 'endDateTime'],
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                startDateTime: { type: 'string', format: 'date-time' },
                endDateTime: { type: 'string', format: 'date-time' },
                channelName: { type: 'string' },
                categories: {
                    type: 'array',
                    items: { type: 'string', enum: Object.values(client_1.$Enums.Profession) },
                },
                oratorIds: { type: 'array', items: { type: 'string' } },
                attendeeIds: { type: 'array', items: { type: 'string' } },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar classroom' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar classroom' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Próximos classrooms' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "upcoming", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Classrooms en vivo' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "live", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de classroom' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/add-orator'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar instructor' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
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
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Classroom ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, OratorDto]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "removeOrator", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los classrooms de una empresa' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'comp_001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: [
                {
                    id: 'cls_001',
                    title: 'Botox Masterclass',
                    description: 'Hands-on training',
                    price: 120,
                    startDateTime: '2025-06-10T14:00:00.000Z',
                    endDateTime: '2025-06-10T17:00:00.000Z',
                    channelName: 'classroom-btx-001',
                    categories: ['DERMATOLOGIA'],
                    empresaId: 'comp_001',
                    orators: [{ id: 'instr_001' }],
                    attendees: [{ id: 'user_001' }],
                    enrollments: [{ id: 'enr_001', userId: 'user_001', status: 'CONFIRMED' }],
                    imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
                    isLive: false
                }
            ]
        }
    }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findAllByEmpresa", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('empresas/:empresaId/classrooms'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map