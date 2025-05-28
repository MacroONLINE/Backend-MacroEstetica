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
    async setup(empresaId, body, files) {
        const logo = files.find((f) => f.fieldname === 'logo');
        const slides = files.filter((f) => f.fieldname === 'slides');
        if (!Object.values(client_1.Giro).includes(body.giro)) {
            throw new common_1.BadRequestException('Giro inválido');
        }
        const slidesMeta = body.slidesMeta ? JSON.parse(body.slidesMeta) : [];
        return this.minisite.setupMinisite(empresaId, {
            name: body.name,
            description: body.description,
            giro: body.giro,
            slogan: body.slogan,
            slidesMeta,
        }, { logo, slides });
    }
    async bulkProducts(empresaId, productsRaw, rawFiles) {
        const meta = JSON.parse(productsRaw ?? '[]');
        const buckets = {};
        for (const f of rawFiles) {
            const match = /^(.+)_(\d+)$/.exec(f.fieldname);
            if (!match)
                continue;
            const [, key, idxStr] = match;
            const idx = Number(idxStr);
            if (!buckets[idx])
                buckets[idx] = { gallery: [] };
            if (key === 'main')
                buckets[idx].main = f;
            if (key === 'gallery')
                buckets[idx].gallery.push(f);
        }
        return this.minisite.bulkUpsertProductsIndexed(empresaId, meta, buckets);
    }
};
exports.MinisiteController = MinisiteController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Cuotas y objetos de todos los códigos',
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
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiParam)({ name: 'code', enum: client_1.FeatureCode, example: client_1.FeatureCode.BANNER_PRODUCT_SLOTS }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Objetos de todos los códigos' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'object' } },
        },
    }),
    (0, common_1.Get)(':empresaId/objects'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getObjects", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Objetos de un código' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiParam)({ name: 'code', enum: client_1.FeatureCode, example: client_1.FeatureCode.STATIC_IMAGES_TOTAL }),
    (0, swagger_1.ApiOkResponse)({
        schema: { type: 'array', items: { type: 'object' } },
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
            required: ['name', 'categoryId'],
            properties: {
                id: { type: 'string', example: 'prod123' },
                name: { type: 'string' },
                description: { type: 'string' },
                categoryId: { type: 'integer' },
                imageMain: { type: 'string' },
            },
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
            required: ['title', 'banner'],
            properties: {
                id: { type: 'string', example: 'ban01' },
                title: { type: 'string' },
                banner: { type: 'string' },
                description: { type: 'string' },
                cta_button_text: { type: 'string' },
                cta_url: { type: 'string' },
            },
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
            required: ['productId'],
            properties: {
                id: { type: 'string', example: 'feat01' },
                productId: { type: 'string' },
                order: { type: 'integer' },
                tagline: { type: 'string' },
            },
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
            required: ['productId', 'highlightFeatures'],
            properties: {
                id: { type: 'string', example: 'high01' },
                productId: { type: 'string' },
                highlightFeatures: { type: 'array', items: { type: 'string' } },
                highlightDescription: { type: 'string' },
                hoghlightImageUrl: { type: 'string' },
            },
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
        summary: 'Configurar información general, logo y slides',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'description', 'giro', 'slidesMeta'],
            properties: {
                name: { type: 'string', example: 'DermaCorp' },
                description: { type: 'string', example: 'Laboratorio dermocosmético' },
                giro: {
                    type: 'string',
                    enum: Object.values(client_1.Giro),
                    example: client_1.Giro.EMPRESA_PROFESIONAL_PERFIL,
                },
                slogan: { type: 'string', example: 'Belleza clínica al alcance' },
                slidesMeta: {
                    type: 'string',
                    example: '[{"title":"Promo","description":"-20%","cta":"Comprar"}]',
                },
                logo: { type: 'string', format: 'binary' },
                slides: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, common_1.Put)(':empresaId/setup'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", Promise)
], MinisiteController.prototype, "setup", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk-upsert de productos (NORMAL, FEATURED, HIGHLIGHT u OFFER)',
        description: `
      Envía multipart/form-data con:
      - products: JSON array de metadatos de cada producto (misma posición que los archivos).
      - Archivos nombrados main_i (imagen principal) y gallery_i (galería) por índice i.
      
      Campos específicos por tipo:
      • NORMAL  
        Ejemplo: { "name": "Producto A", "type": "NORMAL", "description": "Una crema hidratante" }
      
      • FEATURED  
        Ejemplo: { "name": "Producto B", "type": "FEATURED", "order": 1, "tagline": "Top ventas" }
      
      • HIGHLIGHT  
        Ejemplo: { "name": "Producto C", "type": "HIGHLIGHT", "highlightFeatures": ["Alta concentración","Sin parabenos"], "highlightDescription": "Nuevo lanzamiento" }
      
      • OFFER  
        Ejemplo: { "name": "Producto D", "type": "OFFER", "title": "Descuento especial", "offerDescription": "20% de descuento" }
      
      Ejemplo completo de products:
      [
        { "name": "Producto A", "type": "NORMAL", "description": "Una crema hidratante" },
        { "name": "Producto B", "type": "FEATURED", "order": 1, "tagline": "Top ventas" },
        { "name": "Producto C", "type": "HIGHLIGHT", "highlightFeatures": ["Alta concentración","Sin parabenos"], "highlightDescription": "Nuevo lanzamiento" },
        { "name": "Producto D", "type": "OFFER", "title": "Descuento especial", "offerDescription": "20% de descuento" }
      ]
      `
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'ckqs889df0000g411o2o1p4sa' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['products'],
            properties: {
                products: {
                    type: 'string',
                    description: 'JSON array con la metadata de los productos en orden',
                    example: `[{"name":"Producto A","type":"NORMAL"},` +
                        `{"name":"Producto B","type":"FEATURED","order":1,"tagline":"Top ventas"}]`,
                },
                main_0: { type: 'string', format: 'binary', description: 'Imagen principal del producto 0' },
                gallery_0: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Galería del producto 0' },
                main_1: { type: 'string', format: 'binary', description: 'Imagen principal del producto 1' },
                gallery_1: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Galería del producto 1' },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista con IDs y tipos de los productos procesados',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    productId: { type: 'string', example: 'ckxyz123' },
                    type: { type: 'string', enum: ['NORMAL', 'FEATURED', 'HIGHLIGHT', 'OFFER'] },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, common_1.Put)(':empresaId/products'),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)('products')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], MinisiteController.prototype, "bulkProducts", null);
exports.MinisiteController = MinisiteController = __decorate([
    (0, swagger_1.ApiTags)('Minisite'),
    (0, common_1.Controller)('minisite'),
    __metadata("design:paramtypes", [minisite_service_1.MinisiteService])
], MinisiteController);
//# sourceMappingURL=minisite.controller.js.map