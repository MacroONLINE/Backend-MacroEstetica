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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const swagger_1 = require("@nestjs/swagger");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    async getAllBlogs() {
        return this.blogService.getAllBlogs();
    }
    async getBlogById(id) {
        const blog = await this.blogService.getBlogById(id);
        if (!blog)
            throw new common_1.NotFoundException('Blog no encontrado');
        return blog;
    }
    async getBlogsByEmpresa(empresaId) {
        return this.blogService.getBlogsByEmpresa(empresaId);
    }
    async getBlogsByAuthor(authorId) {
        return this.blogService.getBlogsByAuthor(authorId);
    }
    async getBlogsByCategory(categoryId) {
        return this.blogService.getBlogsByCategory(categoryId);
    }
    async getTopRatedBlogs() {
        return this.blogService.getTopRatedBlogs();
    }
    async getRecentBlogs() {
        return this.blogService.getRecentBlogs();
    }
    async searchBlogs(query) {
        return this.blogService.searchBlogs(query);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los posts del blog ordenados por fecha de creación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs obtenida con éxito' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un post del blog por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del blog post', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogById", null);
__decorate([
    (0, common_1.Get)('empresa/:empresaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los posts de una empresa específica' }),
    (0, swagger_1.ApiParam)({ name: 'empresaId', description: 'ID de la empresa dueña del blog', example: '456e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs obtenida' }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogsByEmpresa", null);
__decorate([
    (0, common_1.Get)('autor/:authorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los posts de un autor específico' }),
    (0, swagger_1.ApiParam)({ name: 'authorId', description: 'ID del autor del blog', example: '789e4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs obtenida' }),
    __param(0, (0, common_1.Param)('authorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogsByAuthor", null);
__decorate([
    (0, common_1.Get)('categoria/:categoryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los posts de una categoría específica' }),
    (0, swagger_1.ApiParam)({ name: 'categoryId', description: 'ID de la categoría', example: 'abcde4567-e89b-12d3-a456-426614174000' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs obtenida' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getBlogsByCategory", null);
__decorate([
    (0, common_1.Get)('mejor-calificados'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener los posts mejor calificados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs mejor calificados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getTopRatedBlogs", null);
__decorate([
    (0, common_1.Get)('recientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener los posts más recientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs más recientes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "getRecentBlogs", null);
__decorate([
    (0, common_1.Get)('busqueda'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar blogs por título o contenido' }),
    (0, swagger_1.ApiQuery)({ name: 'query', description: 'Texto de búsqueda', example: 'dermatología', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de blogs filtrados por búsqueda' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "searchBlogs", null);
exports.BlogController = BlogController = __decorate([
    (0, swagger_1.ApiTags)('Blog'),
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map