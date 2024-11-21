import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: CreateProductDto) {
    const { companyId, ...productData } = data;

    return this.prisma.product.create({
      data: {
        ...productData,
        company: { connect: { id: companyId } }, // Transform companyId into Prisma's connect syntax
      },
    });
  }

  async getProductsByCompany(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
    });
  }

  async updateProduct(productId: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async deleteProduct(productId: number) {
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async setProductFeatured(productId: number, isFeatured: boolean) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { isFeatured },
    });
  }

  async getFeaturedProducts(limit: number) {
    return this.prisma.product.findMany({
      where: { isFeatured: true },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
