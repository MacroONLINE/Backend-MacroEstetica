import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getBlogById(id: string) {
    const blog = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        empresa: { select: { name: true } },
        categories: true,
        comments: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!blog) throw new NotFoundException('Blog no encontrado');
    return blog;
  }

  async getBlogsByEmpresa(empresaId: string) {
    return this.prisma.blogPost.findMany({
      where: { empresaId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        categories: true,
      },
    });
  }

  async getBlogsByAuthor(authorId: string) {
    return this.prisma.blogPost.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        empresa: { select: { name: true } },
        categories: true,
      },
    });
  }

  async getBlogsByCategory(categoryId: string) {
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
      take: 10, // Devuelve los 10 mejores calificados
      include: {
        author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        empresa: { select: { name: true } },
      },
    });
  }

  async getRecentBlogs() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10, // Devuelve los 10 más recientes
      include: {
        author: { include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } } },
        empresa: { select: { name: true } },
      },
    });
  }

  async searchBlogs(query: string) {
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
}
