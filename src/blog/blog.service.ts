import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todos los blogs, ordenados por fecha de creación descendente.
   */
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

  /**
   * Obtiene un blog por su ID.
   */
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
    if (!blog) throw new NotFoundException('Blog no encontrado');
    return this.formatBlogDates(blog);
  }

  /**
   * Obtiene todos los blogs de una empresa específica.
   */
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

  /**
   * Obtiene todos los blogs de un autor específico (BlogAuthor).
   */
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

  /**
   * Obtiene todos los blogs de una categoría específica, filtrando por ID de la categoría.
   */
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

  /**
   * Obtiene los 10 blogs con mayor calificación promedio.
   */
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

  /**
   * Obtiene los 10 blogs más recientes (fecha de creación).
   */
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

  /**
   * Busca blogs por coincidencia en título, contenido o nombre de categoría.
   * Se ignoran acentos y mayúsculas/minúsculas.
   */
  async searchBlogs(query: string) {
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Filtra por título, contenido o nombre de la categoría (insensible a mayúsculas).
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

  /**
   * Votar (útil / no útil) y comentar un post de blog en una sola acción.
   */
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
      throw new BadRequestException(
        'El usuario ya ha comentado en este post.',
      );
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

  /**
   * Obtiene todas las categorías de blog.
   */
  async getAllCategories() {
    return this.prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Incrementa el contador de lectores de un blog.
   */
  async incrementReaderCount(postId: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Blog no encontrado');

    const updated = await this.prisma.blogPost.update({
      where: { id: postId },
      data: { totalReaders: { increment: 1 } },
      select: { totalReaders: true },
    });
    return { totalReaders: updated.totalReaders };
  }

  /**
   * Formatea las fechas de creación a formatos específicos para la vista.
   */
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
