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
        const data = await this.prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
                categories: true,
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async getBlogById(id) {
        const blog = await this.prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
                categories: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!blog)
            throw new common_1.NotFoundException('Blog no encontrado');
        return this.formatBlogDates(blog);
    }
    async getBlogsByEmpresa(empresaId) {
        const data = await this.prisma.blogPost.findMany({
            where: { empresaId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                categories: true,
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async getBlogsByAuthor(authorId) {
        const data = await this.prisma.blogPost.findMany({
            where: { authorId },
            orderBy: { createdAt: 'desc' },
            include: {
                empresa: { select: { name: true } },
                categories: true,
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async getBlogsByCategory(categoryId) {
        const data = await this.prisma.blogPost.findMany({
            where: {
                categories: {
                    some: { id: categoryId },
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async getTopRatedBlogs() {
        const data = await this.prisma.blogPost.findMany({
            orderBy: { averageRating: 'desc' },
            take: 10,
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async getRecentBlogs() {
        const data = await this.prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async searchBlogs(query) {
        const normalizedQuery = query
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        const data = await this.prisma.blogPost.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: normalizedQuery,
                            mode: 'insensitive',
                        },
                    },
                    {
                        content: {
                            contains: normalizedQuery,
                            mode: 'insensitive',
                        },
                    },
                    {
                        categories: {
                            some: {
                                name: {
                                    contains: normalizedQuery,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    },
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
                empresa: { select: { name: true } },
                categories: true,
            },
        });
        return data.map((item) => this.formatBlogDates(item));
    }
    async voteAndComment(postId, userId, useful, commentContent) {
        const existingComment = await this.prisma.blogComment.findFirst({
            where: { postId, userId },
        });
        if (existingComment) {
            throw new common_1.BadRequestException('El usuario ya ha comentado en este post.');
        }
        await this.prisma.$transaction([
            this.prisma.blogComment.create({
                data: { postId, userId, content: commentContent },
            }),
            this.prisma.blogPost.update({
                where: { id: postId },
                data: useful
                    ? { usefulCount: { increment: 1 } }
                    : { notUsefulCount: { increment: 1 } },
            }),
        ]);
        return { message: 'Voto y comentario registrados correctamente.' };
    }
    async getAllCategories() {
        return this.prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async incrementReaderCount(postId) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id: postId },
        });
        if (!post)
            throw new common_1.NotFoundException('Blog no encontrado');
        const updated = await this.prisma.blogPost.update({
            where: { id: postId },
            data: { totalReaders: { increment: 1 } },
            select: { totalReaders: true },
        });
        return { totalReaders: updated.totalReaders };
    }
    formatBlogDates(item) {
        const cardDate = new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(item.createdAt);
        const titleDate = item.createdAt.toISOString().split('T')[0];
        return {
            ...item,
            createdAtCard: cardDate,
            createdAtTitle: titleDate,
        };
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map