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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(dto) {
        return this.productService.create(dto);
    }
    async findAll(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findAll(companyId, userId);
    }
    async findByCategory(companyId, categoryId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findByCategory(companyId, Number(categoryId), userId);
    }
    async findFeatured(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findFeaturedByCompany(companyId, userId);
    }
    async findHighlighted(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findHighlightedByCompany(companyId, userId);
    }
    async findOffer(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findOfferByCompany(companyId, userId);
    }
    async findNormal(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findNormalByCompany(companyId, userId);
    }
    async findAllGrouped(companyId, userId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findAllGroupedByType(companyId, userId);
    }
    async findById(id, userId) {
        return this.productService.findById(id, userId);
    }
    async update(id, body, files) {
        return this.productService.updateWithImages(id, body, files);
    }
    async remove(id) {
        return this.productService.remove(id);
    }
    async reactToProduct(productId, userId, type) {
        return this.productService.toggleProductReaction(userId, productId, type || client_1.ReactionType.LIKE);
    }
    async getProductWishlist(userId) {
        return this.productService.getLikedProducts(userId);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado correctamente.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos por categoría dentro de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos destacados de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)('highlighted'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos highlight de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findHighlighted", null);
__decorate([
    (0, common_1.Get)('offer'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos offer de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOffer", null);
__decorate([
    (0, common_1.Get)('normal'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos normales de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findNormal", null);
__decorate([
    (0, common_1.Get)('grouped'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos agrupados por tipo' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAllGrouped", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto con imágenes y tipo' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string', enum: ['NORMAL', 'FEATURED', 'HIGHLIGHT', 'OFFER'] },
                name: { type: 'string' },
                description: { type: 'string' },
                lab: { type: 'string' },
                activeIngredients: { type: 'string' },
                features: { type: 'string' },
                benefits: { type: 'string' },
                problemAddressed: { type: 'string' },
                imageMain: { type: 'string' },
                isFeatured: { type: 'string' },
                isBestSeller: { type: 'string' },
                isOnSale: { type: 'string' },
                categoryId: { type: 'string' },
                companyId: { type: 'string' },
                order: { type: 'string' },
                tagline: { type: 'string' },
                highlightFeatures: { type: 'string' },
                highlightDescription: { type: 'string' },
                title: { type: 'string' },
                offerDescription: { type: 'string' },
                main: { type: 'string', format: 'binary' },
                gallery_0: { type: 'string', format: 'binary' },
                gallery_1: { type: 'string', format: 'binary' },
                gallery_2: { type: 'string', format: 'binary' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':productId/user/:userId/react'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Like/Dislike para un producto' }),
    (0, swagger_1.ApiParam)({ name: 'productId' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['type'],
            properties: { type: { type: 'string', enum: ['LIKE', 'DISLIKE'] } },
        },
    }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "reactToProduct", null);
__decorate([
    (0, common_1.Get)('user/:userId/wishlist'),
    (0, swagger_1.ApiOperation)({ summary: 'Productos a los que el usuario dio like' }),
    (0, swagger_1.ApiParam)({ name: 'userId' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductWishlist", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [products_service_1.ProductService])
], ProductController);
//# sourceMappingURL=products.controller.js.map