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
        this.logger = new common_1.Logger('MinisiteController');
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
    getSetup(empresaId) {
        this.logger.verbose(`GET /minisite/${empresaId}/setup`);
        return this.minisite.getMinisiteSetup(empresaId);
    }
    async setup(empresaId, body, files) {
        this.logger.verbose(`PUT /minisite/${empresaId}/setup payload: ${JSON.stringify(body)}`);
        const logo = files.find((f) => f.fieldname === 'logo');
        const slides = files.filter((f) => f.fieldname === 'slides');
        const slidesMeta = body.slidesMeta ? JSON.parse(body.slidesMeta) : [];
        return this.minisite.setupMinisite(empresaId, {
            name: body.name,
            description: body.description,
            giro: body.giro,
            slogan: body.slogan,
            slidesMeta,
            minisiteColor: body.minisiteColor,
        }, { logo, slides });
    }
    async bulkProducts(empresaId, productsRaw, rawFiles) {
        const meta = JSON.parse(productsRaw ?? '[]');
        const buckets = {};
        for (const f of rawFiles) {
            const m = /^(.+)_(\d+)$/.exec(f.fieldname);
            if (!m)
                continue;
            const [, key, idxStr] = m;
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
    (0, swagger_1.ApiOperation)({ summary: 'Cuotas y objetos de todos los códigos' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
    (0, swagger_1.ApiOkResponse)({ type: minisite_quota_dto_1.UsageResponseDto, isArray: true }),
    (0, common_1.Get)(':empresaId/quotas'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getQuotas", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Cuota y objetos de un código' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Obtener configuración general del minisite' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Datos del minisite, banners y uso de slots',
        schema: {
            example: {
                company: {
                    name: 'Empresa PRUEBA CA',
                    location: null,
                    title: null,
                    giro: 'EMPRESA_PROFESIONAL_PERFIL',
                    profileImage: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332034/11_que_es_un_cosmetico_lider_uy08ij.jpg',
                    minisite: {
                        minisiteColor: '#0000FF',
                        slogan: 'Lo esencial al mejor precio'
                    }
                },
                minisiteColor: '#0000FF',
                slides: [
                    {
                        id: 'slide-001',
                        title: 'Bienvenido a Aromaterapia',
                        imageSrc: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332035/12_apartologia_peque_gkmvrb.png',
                        order: 1
                    },
                    {
                        id: 'slide-002',
                        title: 'Productos Destacados',
                        imageSrc: 'https://res.cloudinary.com/dwcrzwawj/image/upload/v1735332034/11_que_es_un_cosmetico_lider_uy08ij.jpg',
                        order: 2
                    }
                ],
                slideUsage: {
                    used: 2,
                    limit: 6
                },
                banners: [
                    {
                        id: 'banner-002',
                        banner: 'https://example.com/banner2.jpg',
                        title: 'Nuevo Taller',
                        description: 'Aprende de los mejores instructores',
                        date: '2025-01-06T00:42:42.213Z',
                        cta_url: 'http://example.com/cta2',
                        cta_button_text: 'Inscríbete',
                        logo: 'https://example.com/logo2.png',
                        empresaId: 'company-001',
                        createdAt: '2025-01-06T00:42:42.213Z',
                        updatedAt: '2025-01-06T00:42:42.213Z'
                    }
                ]
            }
        }
    }),
    (0, common_1.Get)(':empresaId/setup'),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinisiteController.prototype, "getSetup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Configurar datos generales, color, logo y slides' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['name', 'description', 'giro', 'slidesMeta'],
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                giro: { type: 'string', enum: Object.values(client_1.Giro) },
                slogan: { type: 'string' },
                minisiteColor: { type: 'string' },
                slidesMeta: { type: 'string' },
                logo: { type: 'string', format: 'binary' },
                slides: { type: 'array', items: { type: 'string', format: 'binary' } },
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
Envía **multipart/form-data** con:

- **products**: string (JSON.stringify de un array con la metadata – misma posición que los archivos).
- Archivos nombrados **main_i** (imagen principal) y **gallery_i** (galería) por índice **i**.

### Ejemplos de objetos **products**

\`\`\`json
[
  {
    "name": "Gel Limpiador Facial",
    "type": "NORMAL",
    "description": "Limpieza profunda sin resecar la piel",
    "categoryId": 11,
    "activeIngredients": ["Ácido salicílico 2 %", "Zinc PCA"],
    "benefits": ["Regula sebo", "Desobstruye poros"],
    "features": ["pH 5.5", "Sin sulfatos", "No comedogénico"],
    "isFeatured": false,
    "isBestSeller": true,
    "isOnSale": false,
    "presentations": "50 ml, 100 ml, 250 ml",
    "lab": "DermaCare Labs",
    "problemAddressed": "Acné leve"
  },
  {
    "name": "Ampolla Rejuvenecedora",
    "type": "FEATURED",
    "order": 1,
    "tagline": "Efecto flash inmediato",
    "description": "Con péptidos y factor de crecimiento",
    "categoryId": 12,
    "activeIngredients": ["Péptidos", "Ácido hialurónico"],
    "benefits": ["Tensa", "Ilumina"],
    "features": ["Uso profesional"],
    "lab": "BeautyScience"
  },
  {
    "name": "Crema Reparadora Noche",
    "type": "HIGHLIGHT",
    "highlightFeatures": ["Retinol 0.3 %", "Ceramidas", "Niacinamida"],
    "highlightDescription": "Renueva barrera cutánea mientras duermes",
    "categoryId": 13,
    "description": "Nutrición intensiva"
  },
  {
    "name": "Serum Vitamina C 20 %",
    "type": "OFFER",
    "title": "2×1 de lanzamiento",
    "offerDescription": "Promoción válida hasta el 31/12",
    "categoryId": 14,
    "description": "Antioxidante de alta potencia"
  }
]
\`\`\`
    `,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConflictResponse)({
        description: 'Se superó el cupo permitido para el plan (PRODUCTS_TOTAL, FEATURED_PRODUCTS_TOTAL, etc.)',
    }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'La categoría indicada ya contiene 12 productos',
    }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', example: 'company-001' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['products'],
            properties: {
                products: {
                    type: 'string',
                    description: 'JSON array con la metadata de los productos en orden',
                },
                main_0: { type: 'string', format: 'binary', description: 'Imagen principal del producto 0' },
                gallery_0: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Galería del producto 0' },
                main_1: { type: 'string', format: 'binary', description: 'Imagen principal del producto 1' },
                gallery_1: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Galería del producto 1' },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Límite por categoría o cupo general excedido' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista con IDs y tipos de los productos procesados',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    productId: { type: 'string' },
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