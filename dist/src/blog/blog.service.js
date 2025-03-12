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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBlogs() {
        return this.prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
                categories: true,
            },
        });
    }
    async getBlogById(id) {
        const blog = await this.prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
                categories: true,
                comments: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
        });
        if (!blog)
            throw new common_1.NotFoundException('Blog no encontrado');
        return blog;
    }
    async getBlogsByEmpresa(empresaId) {
        return this.prisma.blogPost.findMany({
            where: { empresaId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                categories: true,
            },
        });
    }
    async getBlogsByAuthor(authorId) {
        return this.prisma.blogPost.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
            include: {
                empresa: { select: { name: true } },
                categories: true,
            },
        });
    }
    async getBlogsByCategory(categoryId) {
        return this.prisma.blogPost.findMany({
            where: { categories: { some: { id: categoryId } } },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
            },
        });
    }
    async getTopRatedBlogs() {
        return this.prisma.blogPost.findMany({
            orderBy: { averageRating: 'desc' },
            take: 10,
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
            },
        });
    }
    async getRecentBlogs() {
        return this.prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
            },
        });
    }
    async searchBlogs(query) {
        return this.prisma.blogPost.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
                empresa: { select: { name: true } },
            },
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map