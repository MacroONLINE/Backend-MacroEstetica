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
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(dto) {
        return this.productService.create(dto);
    }
    async findAll(companyId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findAll(companyId);
    }
    async findByCategory(companyId, categoryId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        const products = await this.productService.findByCategory(companyId, Number(categoryId));
        if (!products.length) {
            throw new common_1.NotFoundException(`No se encontraron productos para la categoría ${categoryId} en la empresa ${companyId}`);
        }
        return products;
    }
    async findFeatured(companyId) {
        if (!companyId)
            throw new common_1.NotFoundException('Debe especificar un ID de empresa');
        return this.productService.findFeaturedByCompany(companyId);
    }
    async findById(id) {
        return this.productService.findById(id);
    }
    async update(id, dto) {
        return this.productService.update(id, dto);
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
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos por categoría dentro de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: true }),
    __param(0, (0, common_1.Query)('companyId')),
    __param(1, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos destacados de una empresa' }),
    (0, swagger_1.ApiQuery)({ name: 'companyId', required: true }),
    __param(0, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':productId/user/:userId/react'),
    (0, swagger_1.ApiOperation)({
        summary: 'Like/Dislike para un producto',
        description: 'Si no existe reacción, se crea. Si existe la misma, se elimina. Si existe la opuesta, se cambia.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productId', description: 'ID del producto' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['type'],
            properties: {
                type: { type: 'string', enum: ['LIKE', 'DISLIKE'], example: 'LIKE' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reacción procesada.' }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "reactToProduct", null);
__decorate([
    (0, common_1.Get)('user/:userId/wishlist'),
    (0, swagger_1.ApiOperation)({ summary: 'Productos a los que el usuario dio like (wishlist)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
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