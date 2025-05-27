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
exports.MinisiteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const client_1 = require("@prisma/client");
const minisite_service_1 = require("./minisite.service");
const minisite_quota_dto_1 = require("./dto/minisite-quota.dto");
let MinisiteController = class MinisiteController {
    constructor(minisite) {
        this.minisite = minisite;
    }
    getQuotas(empresaId) {
        return this.minisite.quotas(empresaId);
    }
    getQuota(empresaId, code) {
        return this.minisite.quota(empresaId, code);
    }
    getObjects(empresaId) {
        return this.minisite.objects(empresaId);
    }
    getObjectsByCode(empresaId, code) {
        return this.minisite.objectsByCode(empresaId, code);
    }
    upsertProduct(empresaId, body) {
        return this.minisite.upsertProduct(empresaId, body);
    }
    upsertBanner(empresaId, body) {
        return this.minisite.upsertBanner(empresaId, body);
    }
    upsertFeatured(empresaId, body) {
        return this.minisite.upsertFeatured(empresaId, body);
    }
    upsertHighlight(empresaId, body) {
        return this.minisite.upsertHighlight(empresaId, body);
    }
    setup(empresaId, body, files) {
        const logo = files.find((f) => f.fieldname === 'logo');
        const slides = files.filter((f) => f.fieldname === 'slides');
        const slidesMeta = body.slidesMeta
            ? JSON.parse(body.slidesMeta)
            : [];
        const categories = body.categories
            .split(',')
            .map((c) => c);
        return this.minisite.setupMinisite(empresaId, {
            name: body.name,
            description: body.description,
            slogan: body.slogan,
            categories,
            slidesMeta,
        }, { logo, slides });
    }
};
exports.MinisiteController = MinisiteController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Cuotas y objetos de todos los códigos',
        description: 'Array con cada FeatureCode, su límite (limit), lo usado (used) y los objetos (items).',
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiOkResponse)({ type: minisite_quota_dto_1.UsageResponseDto, isArray: true }),
    (0, common_1.Get)(':empresaId/quotas'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getQuotas", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Cuota y objetos de un código',
        description: 'Devuelve límite, usado y objetos del FeatureCode solicitado.',
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        enum: client_1.FeatureCode,
        example: client_1.FeatureCode.BANNER_PRODUCT_SLOTS,
    }),
    (0, swagger_1.ApiOkResponse)({ type: minisite_quota_dto_1.UsageResponseDto }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, common_1.Get)(':empresaId/quota/:code'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('code', new common_1.ParseEnumPipe(client_1.FeatureCode))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getQuota", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Objetos de todos los códigos',
        description: 'Objeto donde cada clave es un FeatureCode y el valor es el array de objetos.',
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'object' } },
            example: {
                PRODUCTS_TOTAL: [{ id: 'p1', name: 'Serum AHA' }],
                STATIC_IMAGES_TOTAL: [{ id: 's1', title: 'Promo' }],
            },
        },
    }),
    (0, common_1.Get)(':empresaId/objects'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getObjects", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Objetos de un código',
        description: 'Array de objetos que consumen la cuota indicada.',
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        enum: client_1.FeatureCode,
        example: client_1.FeatureCode.STATIC_IMAGES_TOTAL,
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'array',
            items: { type: 'object' },
            example: [
                { id: 'slide1', title: 'Promo', imageSrc: 'https://…' },
                { id: 'slide2', title: 'Bienvenida', imageSrc: 'https://…' },
            ],
        },
    }),
    (0, common_1.Get)(':empresaId/objects/:code'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Param)('code', new common_1.ParseEnumPipe(client_1.FeatureCode))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getObjectsByCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar producto' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: 'prod123',
                    description: 'Enviar para actualizar',
                },
                name: { type: 'string', example: 'Serum Vitamina C' },
                description: { type: 'string', example: 'Potente antioxidante' },
                categoryId: { type: 'integer', example: 5 },
                imageMain: { type: 'string', example: 'https://…' },
            },
            required: ['name', 'categoryId'],
        },
    }),
    (0, common_1.Put)(':empresaId/product'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "upsertProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar banner' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'ban01' },
                title: { type: 'string', example: 'Navidad' },
                banner: { type: 'string', example: 'https://…/banner.jpg' },
                description: { type: 'string', example: 'Grandes descuentos' },
                cta_button_text: { type: 'string', example: 'Compra ahora' },
                cta_url: { type: 'string', example: 'https://…' },
            },
            required: ['title', 'banner'],
        },
    }),
    (0, common_1.Put)(':empresaId/banner'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "upsertBanner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar producto destacado' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'feat01' },
                productId: { type: 'string', example: 'prod123' },
                order: { type: 'integer', example: 1 },
                tagline: { type: 'string', example: 'Top ventas' },
            },
            required: ['productId'],
        },
    }),
    (0, common_1.Put)(':empresaId/featured'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "upsertFeatured", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar producto highlight' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'high01' },
                productId: { type: 'string', example: 'prod123' },
                highlightFeatures: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Alta concentración', 'Sin parabenos'],
                },
                highlightDescription: {
                    type: 'string',
                    example: 'Nuevo lanzamiento',
                },
                hoghlightImageUrl: {
                    type: 'string',
                    example: 'https://…/highlight.jpg',
                },
            },
            required: ['productId', 'highlightFeatures'],
        },
    }),
    (0, common_1.Put)(':empresaId/highlight'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "upsertHighlight", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Configurar info general, logo y lote de slides',
        description: 'Multipart/form-data: nombre, descripción, categorías, slogan, logo (file), slides (file[]) y slidesMeta (JSON).',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'DermaCorp' },
                description: {
                    type: 'string',
                    example: 'Laboratorio dermocosmético',
                },
                categories: {
                    type: 'string',
                    example: 'DERMATOLOGIA,COSMETOLOGIA',
                    description: 'Valores del enum Profession separados por comas',
                },
                slogan: {
                    type: 'string',
                    example: 'Belleza clínica al alcance',
                },
                slidesMeta: {
                    type: 'string',
                    example: '[{"title":"Promo","description":"-20%","cta":"Comprar"}]',
                    description: 'JSON array de metadatos para cada slide',
                },
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'PNG 200×200',
                },
                slides: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Imágenes (máx 10 MB c/u)',
                },
            },
            required: ['name', 'description', 'categories', 'slidesMeta'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, common_1.Put)(':empresaId/setup'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "setup", null);
exports.MinisiteController = MinisiteController = __decorate([
    (0, swagger_1.ApiTags)('Minisite'),
    (0, common_1.Controller)('minisite'),
    __metadata("design:paramtypes", [minisite_service_1.MinisiteService])
], MinisiteController);
//# sourceMappingURL=minisite.controller.js.map