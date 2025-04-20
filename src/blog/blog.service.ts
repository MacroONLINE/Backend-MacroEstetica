import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {
  private currentDto: any;

  constructor(private readonly prisma: PrismaService) {}

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

  async getBlogById(id: string) {
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
      },
    });
    if (!blog) {
      throw new NotFoundException('Blog no encontrado');
    }
    const formattedBlog = this.formatBlogDates(blog);
    const commentRatings = await this.getUsersCommentRatingForPost(id);
    return {
      ...formattedBlog,
      comments: commentRatings,
    };
  }

  async getBlogsByEmpresa(empresaId: string) {
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

  async getBlogsByAuthor(authorId: string) {
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

  async getBlogsByCategory(categoryId: string) {
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

  async searchBlogs(query: string) {
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
      throw new BadRequestException('El usuario ya ha comentado en este post.');
    }
    const ratingValue = this.currentDto?.rating;
    if (typeof ratingValue !== 'number' || ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestException('El rating debe ser un número entre 1 y 5.');
    }
    const existingRating = await this.prisma.blogRating.findFirst({
      where: { postId, userId },
    });
    if (existingRating) {
      throw new BadRequestException('El usuario ya ha calificado este post.');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.blogComment.create({
        data: { postId, userId, content: commentContent },
      });
      await tx.blogRating.create({
        data: { postId, userId, rating: ratingValue },
      });
      const agg = await tx.blogRating.aggregate({
        where: { postId },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.blogPost.update({
        where: { id: postId },
        data: {
          averageRating: agg._avg.rating || 0,
          totalRatings: agg._count.rating,
          usefulCount: useful ? { increment: 1 } : undefined,
          notUsefulCount: !useful ? { increment: 1 } : undefined,
        },
      });
    });
    return { message: 'Voto, comentario y rating registrados correctamente.' };
  }

  async getAllCategories() {
    return this.prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async incrementReaderCount(postId: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Blog no encontrado');
    }
    const updated = await this.prisma.blogPost.update({
      where: { id: postId },
      data: { totalReaders: { increment: 1 } },
      select: { totalReaders: true },
    });
    return { totalReaders: updated.totalReaders };
  }

  async getUsersCommentRatingForPost(postId: string) {
    const comments = await this.prisma.blogComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });
    const ratings = await this.prisma.blogRating.findMany({
      where: { postId },
    });
    return comments.map((comment) => {
      const userRating = ratings.find((r) => r.userId === comment.userId);
      return {
        userId: comment.userId,
        commentContent: comment.content,
        rating: userRating ? userRating.rating : null,
        firstName: comment.user.firstName,
        lastName: comment.user.lastName,
        profileImageUrl: comment.user.profileImageUrl,
      };
    });
  }

  setCurrentDto(dto: any) {
    this.currentDto = dto;
  }

  private formatBlogDates(item: any) {
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
}
