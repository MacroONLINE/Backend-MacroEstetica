// src/blog/blog.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBlogs() {
    const data = await this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        empresa: { select: { name: true } },
        categories: true
      }
    });
    return data.map((item) => this.formatBlogDates(item));
  }

  async getBlogById(id: string) {
    const blog = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        empresa: { select: { name: true } },
        categories: true,
        comments: {
          include: {
            user: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return this.formatBlogDates(blog);
  }

  async getBlogsByEmpresa(empresaId: string) {
    const data = await this.prisma.blogPost.findMany({
      where: { empresaId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        categories: true
      }
    });
    return data.map((item) => this.formatBlogDates(item));
  }

  async getBlogsByAuthor(authorId: string) {
    const data = await this.prisma.blogPost.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        empresa: { select: { name: true } },
        categories: true
      }
    });
    return data.map((item) => this.formatBlogDates(item));
  }

  async getBlogsByCategory(categoryId: string) {
    const data = await this.prisma.blogPost.findMany({
      where: { categories: { some: { id: categoryId } } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          include: {
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        empresa: { select: { name: true } }
      }
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
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        empresa: { select: { name: true } }
      }
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
            user: { select: { firstName: true, lastName: true, profileImageUrl: true } }
          }
        },
        empresa: { select: { name: true } }
      }
    });
    return data.map((item) => this.formatBlogDates(item));
  }

  async searchBlogs(query: string) {
    const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const data = await this.prisma.blogPost.findMany({
      where: {
        OR: [
          { title: { contains: normalizedQuery, mode: 'insensitive' } },
          { content: { contains: normalizedQuery, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          include: { user: { select: { firstName: true, lastName: true, profileImageUrl: true } } },
        },
        empresa: { select: { name: true } },
      },
    });

    return data.map((item) => this.formatBlogDates(item));
  }

  // Método para votar y comentar en un solo método
  async voteAndComment(
    postId: string,
    userId: string,
    useful: boolean,
    commentContent: string,
  ) {
    const existingComment = await this.prisma.blogComment.findFirst({
      where: { postId, userId },
    });

    if (existingComment) {
      throw new BadRequestException('User has already commented on this post.');
    }

    await this.prisma.$transaction([
      this.prisma.blogComment.create({
        data: { postId, userId, content: commentContent },
      }),
      this.prisma.blogPost.update({
        where: { id: postId },
        data: useful ? { usefulCount: { increment: 1 } } : { notUsefulCount: { increment: 1 } },
      }),
    ]);

    return { message: 'Vote and comment successfully registered.' };
  }

  async getAllCategories() {
    return this.prisma.blogCategory.findMany();
  }

  async incrementReaderCount(postId: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Blog not found');
    const updated = await this.prisma.blogPost.update({
      where: { id: postId },
      data: { totalReaders: { increment: 1 } },
      select: { totalReaders: true }
    });
    return { totalReaders: updated.totalReaders };
  }

 
  private formatBlogDates(item: any) {
    const cardDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(item.createdAt);
    const titleDate = item.createdAt.toISOString().split('T')[0];
    return {
      ...item,
      createdAtCard: cardDate,
      createdAtTitle: titleDate
    };
  }
}
