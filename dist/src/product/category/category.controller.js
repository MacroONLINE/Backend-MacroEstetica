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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const client_1 = require("@prisma/client");
class UpdateCategoryDto extends (0, mapped_types_1.PartialType)(create_category_dto_1.CreateCategoryDto) {
}
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    create(dto) {
        return this.categoryService.create(dto);
    }
    findAll() {
        return this.categoryService.findAll();
    }
    findOne(id) {
        return this.categoryService.findOne(+id);
    }
    update(id, data) {
        return this.categoryService.update(+id, data);
    }
    remove(id) {
        return this.categoryService.remove(+id);
    }
    findAllByEmpresa(empresaId) {
        return this.categoryService.findAllByEmpresa(empresaId);
    }
    findCategoriesByEmpresa(empresaId) {
        return this.categoryService.findCategoriesByEmpresa(empresaId);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear categoría' }),
    (0, swagger_1.ApiBody)({ type: create_category_dto_1.CreateCategoryDto }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Categoría creada exitosamente',
        schema: {
            example: {
                id: 1,
                name: 'Cosmiatría y Cosmetología',
                bannerImageUrl: 'https://example.com/images/banner.jpg',
                miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
                companyId: 'company-001',
                company: { logo: 'https://example.com/images/logo.png' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos o límite de categorías excedido' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las categorías' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Listado de todas las categorías',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Cosmiatría y Cosmetología',
                    bannerImageUrl: 'https://example.com/images/banner.jpg',
                    miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
                    companyId: 'company-001',
                    company: { logo: 'https://example.com/images/logo.png' }
                },
                {
                    id: 2,
                    name: 'Dermatología Avanzada',
                    bannerImageUrl: 'https://example.com/images/banner2.jpg',
                    miniSiteImageUrl: 'https://example.com/images/minisite2.jpg',
                    companyId: 'company-002',
                    company: { logo: 'https://example.com/images/logo2.png' }
                }
            ]
        }
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por ID (numérico)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría', example: '1' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Detalle de la categoría',
        schema: {
            example: {
                id: 1,
                name: 'Cosmiatría y Cosmetología',
                bannerImageUrl: 'https://example.com/images/banner.jpg',
                miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
                companyId: 'company-001',
                company: { logo: 'https://example.com/images/logo.png' }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Categoría no encontrada' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría', example: '1' }),
    (0, swagger_1.ApiBody)({ type: UpdateCategoryDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Categoría actualizada',
        schema: {
            example: {
                id: 1,
                name: 'Cosmiatría Moderna',
                bannerImageUrl: 'https://example.com/images/banner-new.jpg',
                miniSiteImageUrl: 'https://example.com/images/minisite-new.jpg',
                companyId: 'company-001',
                company: { logo: 'https://example.com/images/logo.png' }
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Datos inválidos' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría', example: '1' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Categoría eliminada',
        schema: {
            example: {
                id: 1,
                name: 'Cosmiatría y Cosmetología',
                bannerImageUrl: 'https://example.com/images/banner.jpg',
                miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
                companyId: 'company-001',
                company: { logo: 'https://example.com/images/logo.png' }
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Categoría no encontrada' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener categorías + productos de una empresa' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa', example: 'company-001' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Listado de categorías con productos',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Cosmiatría y Cosmetología',
                    bannerImageUrl: 'https://example.com/images/banner.jpg',
                    miniSiteImageUrl: 'https://example.com/images/minisite.jpg',
                    companyId: 'company-001',
                    products: [
                        { id: 'prod-001', name: 'Gel Limpiador Facial' },
                        { id: 'prod-002', name: 'Ampolla Rejuvenecedora' }
                    ],
                    company: { logo: 'https://example.com/images/logo.png' }
                }
            ]
        }
    }),
    (0, common_1.Get)('by-empresa/:empresaId'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findAllByEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener categorías de una empresa (sin productos)' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa', example: 'company-001' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Listado de categorías',
        schema: {
            example: [
                {
                    id: 1,
                    name: 'Cosmiatría y Cosmetología',
                    bannerImageUrl: 'https://example.com/images/banner.jpg',
                    miniSiteImageUrl: 'https://example.com/images/minisite.jpg'
                },
                {
                    id: 2,
                    name: 'Dermatología Avanzada',
                    bannerImageUrl: 'https://example.com/images/banner2.jpg',
                    miniSiteImageUrl: 'https://example.com/images/minisite2.jpg'
                }
            ]
        }
    }),
    (0, common_1.Get)('empresa/:empresaId/categories'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "findCategoriesByEmpresa", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('product-categories'),
    (0, common_1.Controller)('product/categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map