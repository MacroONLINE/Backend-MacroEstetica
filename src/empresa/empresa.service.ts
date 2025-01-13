import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Giro, Target } from '@prisma/client';

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByCategory(category: Giro) {
    return this.prisma.empresa.findMany({
      where: {
        giro: category,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByGiro(giro: Giro) {
    return this.prisma.empresa.findMany({
      where: {
        giro,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByTarget(target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        user: {
          role: target,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getAllByGiroAndTarget(giro: Giro, target: Target) {
    return this.prisma.empresa.findMany({
      where: {
        giro,
        user: {
          role: target,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getEmpresaConMinisite(empresaId: string) {
    return this.prisma.empresa.findUnique({
      where: { id: empresaId },
      include: {
        user: true,
        instructores: true,
        productos: true,
        banners: true,
        categorias: {
          include: {
            products: true,
          },
        },
        minisite: {
          include: {
            slides: true,
            benefits: true,
            offers: {
              include: {
                products: true,
              },
            },
            featuredProducts: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }
}
