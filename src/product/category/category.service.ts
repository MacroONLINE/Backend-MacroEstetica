import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.productCompanyCategory.create({
      data: {
        name: data.name,
        bannerImageUrl: data.bannerImageUrl,
        miniSiteImageUrl: data.miniSiteImageUrl,
        company: {
          connect: { id: data.companyId }, // Aquí conectamos con la empresa
        },
      },
      // Si deseas que en la respuesta ya venga la empresa con el logo, también puedes incluirlo:
      include: {
        company: {
          select: {
            logo: true,
          },
        },
      },
    });
  }
  
  async findAll() {
    return this.prisma.productCompanyCategory.findMany({
      include: {
        company: {
          select: {
            logo: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.productCompanyCategory.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            logo: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ProductCompanyCategoryUpdateInput) {
    return this.prisma.productCompanyCategory.update({
      where: { id },
      data,
      include: {
        company: {
          select: {
            logo: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.productCompanyCategory.delete({
      where: { id },
      include: {
        company: {
          select: {
            logo: true,
          },
        },
      },
    });
  }

  /**
   * Obtener todas las categorías de una empresa en particular,
   * incluyendo los productos de cada categoría y el logo de la empresa.
   */
  async findAllByEmpresa(empresaId: string) {
    return this.prisma.productCompanyCategory.findMany({
      where: { companyId: empresaId },
      include: {
        products: true, // Incluimos la relación de productos
        company: {
          select: {
            logo: true, // Incluir solo el logo de la Empresa
          },
        },
      },
    });
  }
}
