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
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const empresa_service_1 = require("./empresa.service");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
let EmpresaController = class EmpresaController {
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    async getAllByCategory(category) {
        if (!category || !(category in client_1.Giro)) {
            throw new common_1.HttpException('Categoría inválida', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByCategory(category);
    }
    async getAllByGiro(giro) {
        if (!giro || !(giro in client_1.Giro)) {
            throw new common_1.HttpException('Giro inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByGiro(giro);
    }
    async getAllByTarget(target) {
        if (!target || !(target in client_1.Target)) {
            throw new common_1.HttpException('Target inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByTarget(target);
    }
    async getAllByGiroAndTarget(giro, target) {
        if (!giro || !(giro in client_1.Giro)) {
            throw new common_1.HttpException('Giro inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!target || !(target in client_1.Target)) {
            throw new common_1.HttpException('Target inválido', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByGiroAndTarget(giro, target);
    }
    async getMinisiteByEmpresaId(empresaId) {
        const data = await this.empresaService.getEmpresaConMinisite(empresaId);
        if (!data) {
            throw new common_1.HttpException('Empresa o minisitio no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return data;
    }
    async uploadCatalogueFile(empresaId, file) {
        if (!file) {
            throw new common_1.HttpException('No se recibió ningún archivo', common_1.HttpStatus.BAD_REQUEST);
        }
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.HttpException('El archivo debe ser un PDF', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.uploadCatalogue(empresaId, file);
    }
    async getPlanByUserId(userId) {
        return this.empresaService.getPlanByUserId(userId);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresas por categoría' }),
    (0, common_1.Get)('by-category'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresas por giro' }),
    (0, common_1.Get)('by-giro'),
    __param(0, (0, common_1.Query)('giro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByGiro", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresas por target' }),
    (0, common_1.Get)('by-target'),
    __param(0, (0, common_1.Query)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByTarget", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresas por giro y target' }),
    (0, common_1.Get)('by-giro-target'),
    __param(0, (0, common_1.Query)('giro')),
    __param(1, (0, common_1.Query)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByGiroAndTarget", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener minisitio de una empresa' }),
    (0, common_1.Get)(':empresaId/minisite'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getMinisiteByEmpresaId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Subir catálogo (PDF) al minisitio de la empresa' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'PDF a subir como catálogo',
                },
            },
        },
    }),
    (0, common_1.Put)(':empresaId/minisite/catalogue'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "uploadCatalogueFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener plan activo de la empresa por User ID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario relacionado a la empresa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plan encontrado', schema: { type: 'object', properties: { id: { type: 'string' }, type: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' } } } }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plan no encontrado' }),
    (0, common_1.Get)('user/:userId/plan'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getPlanByUserId", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, swagger_1.ApiTags)('empresa'),
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map