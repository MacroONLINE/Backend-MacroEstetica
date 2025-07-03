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
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateClassroomDto.prototype, "oratorNames", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    __metadata("design:type", Array)
], CreateClassroomDto.prototype, "attendeeIds", void 0);
class UpdateClassroomDto extends (0, mapped_types_1.PartialType)(CreateClassroomDto) {
}
let ClassroomController = class ClassroomController {
    constructor(service) {
        this.service = service;
    }
    create(dto, image) {
        return this.service.createClassroom({ ...dto, image });
    }
    update(id, dto, image) {
        return this.service.updateClassroom(id, { ...dto, image });
    }
    remove(id) {
        return this.service.deleteClassroom(id);
    }
    upcoming() {
        return this.service.getUpcomingClassrooms();
    }
    async live() {
        const list = await this.service.getLiveClassrooms();
        if (list.length === 0)
            throw new common_1.NotFoundException('No hay aulas en vivo en este momento');
        return list;
    }
    findOne(id) {
        return this.service.getClassroomById(id);
    }
};
exports.ClassroomController = ClassroomController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un aula (classroom)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiBody)({
        description: 'Todos los campos *startDateTime* y *endDateTime* deben ir en ISO-8601. ' +
            '`oratorNames` acepta una lista de nombres separada por comas.',
        schema: {
            type: 'object',
            required: [
                'title',
                'description',
                'price',
                'startDateTime',
                'endDateTime',
            ],
            properties: {
                title: { type: 'string', example: 'Botox Masterclass' },
                description: { type: 'string', example: 'Hands-on training' },
                price: { type: 'number', example: 120 },
                startDateTime: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-06-10T14:00:00.000Z',
                },
                endDateTime: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-06-10T17:00:00.000Z',
                },
                channelName: {
                    type: 'string',
                    example: 'classroom-btx-001',
                },
                categories: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: Object.values(client_1.$Enums.Profession),
                    },
                    example: ['DERMATOLOGIA'],
                },
                oratorNames: {
                    type: 'string',
                    example: 'Dra. Gómez, Dr. Salazar',
                },
                attendeeIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['user_001', 'user_002'],
                },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Aula creada',
        schema: {
            example: {
                id: 'cls_001',
                title: 'Botox Masterclass',
                description: 'Hands-on training',
                price: 120,
                startDateTime: '2025-06-10T14:00:00.000Z',
                endDateTime: '2025-06-10T17:00:00.000Z',
                channelName: 'classroom-btx-001',
                categories: ['DERMATOLOGIA'],
                oratorNames: 'Dra. Gómez, Dr. Salazar',
                attendeeIds: ['user_001', 'user_002'],
                imageUrl: 'https://cdn.example.com/uploads/btx.jpg',
                isLive: false,
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un aula' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del aula',
        example: 'cls_001',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Envia solo los campos que deseas cambiar. ' +
            'Las categorías reemplazan completamente las anteriores si se envían.',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Nuevo título' },
                description: { type: 'string', example: 'Descripción actualizada' },
                price: { type: 'number', example: 150 },
                startDateTime: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-06-10T15:00:00.000Z',
                },
                endDateTime: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-06-10T18:00:00.000Z',
                },
                channelName: { type: 'string', example: 'classroom-btx-002' },
                categories: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: Object.values(client_1.$Enums.Profession),
                    },
                    example: ['MEDICINA_ESTETICA'],
                },
                oratorNames: {
                    type: 'string',
                    example: 'Dr. Salazar, Dra. Jiménez',
                },
                attendeeIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['user_003'],
                },
                image: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Aula actualizada',
        schema: {
            example: {
                id: 'cls_001',
                title: 'Nuevo título',
                categories: ['MEDICINA_ESTETICA'],
                oratorNames: 'Dr. Salazar, Dra. Jiménez',
                attendeeIds: ['user_003'],
                isLive: false,
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateClassroomDto, Object]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un aula' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del aula', example: 'cls_001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { message: 'Classroom eliminado correctamente' } },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar aulas futuras (aún no inician)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: [
                {
                    id: 'cls_002',
                    title: 'Laser Basics',
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
    (0, swagger_1.ApiOperation)({ summary: 'Listar aulas en vivo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: [
                {
                    id: 'cls_003',
                    title: 'Derm Sutures',
                    startDateTime: '2025-05-20T08:00:00.000Z',
                    endDateTime: '2025-05-20T11:00:00.000Z',
                    isLive: true,
                },
            ],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No hay aulas en vivo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassroomController.prototype, "live", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de un aula' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del aula', example: 'cls_001' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                id: 'cls_001',
                title: 'Botox Masterclass',
                price: 120,
                oratorNames: 'Dra. Gómez, Dr. Salazar',
                attendeeIds: ['user_001', 'user_002'],
                categories: ['DERMATOLOGIA'],
                isLive: false,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aula no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassroomController.prototype, "findOne", null);
exports.ClassroomController = ClassroomController = __decorate([
    (0, swagger_1.ApiTags)('Classrooms'),
    (0, common_1.Controller)('classroom'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __metadata("design:paramtypes", [classroom_service_1.ClassroomService])
], ClassroomController);
//# sourceMappingURL=classroom.controller.js.map