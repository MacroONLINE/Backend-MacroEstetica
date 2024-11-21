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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async createProduct(createProductDto) {
        return this.productsService.createProduct(createProductDto);
    }
    async getProductsByCompany(companyId) {
        return this.productsService.getProductsByCompany(companyId);
    }
    async updateProduct(productId, updateProductDto) {
        return this.productsService.updateProduct(productId, updateProductDto);
    }
    async deleteProduct(productId) {
        return this.productsService.deleteProduct(productId);
    }
    async setProductFeatured(productId, isFeatured) {
        return this.productsService.setProductFeatured(productId, isFeatured);
    }
    async getFeaturedProducts(limit = 10) {
        return this.productsService.getFeaturedProducts(limit);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products for a company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Products retrieved successfully.' }),
    (0, common_1.Get)('company/:companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductsByCompany", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully.' }),
    (0, common_1.Put)(':productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully.' }),
    (0, common_1.Delete)(':productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set a product as featured' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product featured status updated.' }),
    (0, common_1.Patch)(':productId/featured'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)('isFeatured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "setProductFeatured", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get featured products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Featured products retrieved successfully.' }),
    (0, common_1.Get)('featured'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getFeaturedProducts", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map